/// <reference types="cypress" />

const appUrl = "https://qauto.forstudy.space";
const basicAuth = { username: "guest", password: "welcome2qauto" };

function uniqueEmail(prefix = "qa") {
  const ts = Date.now();
  return `${prefix}+${ts}@example.com`;
}

const sel = {
  signInBtn: 'button.header_signin, button:contains("Sign In")',
  registerTabBtn: 'button:contains("Registration"), a:contains("Registration")',
  modal: ".modal-content",
  name: "#signupName",
  lastName: "#signupLastName",
  email: "#signupEmail",
  password: "#signupPassword",          
  rePassword: "#signupRepeatPassword",    
  registerBtn: 'button[type="submit"]:contains("Register"), button:contains("Register")',
  errorMsg: ".invalid-feedback, .error, .text-danger, mat-error, .ng-invalid ~ .invalid-feedback",
};

function openRegistration() {
  cy.visit(appUrl, { auth: basicAuth });
  cy.get(sel.signInBtn).should("be.visible").click({ force: true });
  cy.get(sel.modal).should("be.visible");
  cy.get("body").then(($b) => {
    const hasRegisterTab = $b.find(sel.registerTabBtn).length > 0;
    if (hasRegisterTab) cy.get(sel.registerTabBtn).click({ force: true });
  });
  cy.get(sel.registerBtn).should("be.visible");
}

describe("Registration form — validation & happy path", () => {
  beforeEach(() => {
    openRegistration();
  });

  it("Register button should be disabled with empty form", () => {
    cy.get(sel.registerBtn).should("be.disabled");
  });

  it("Name field validation", () => {
  const required = /Name(?:\s+is)?\s+required/i;
  const tooShortOrLong = /from 2 to 20/i;
  const invalid = /Name(?:\s+is)?\s+invalid/i;

  cy.get(sel.name).as("name").focus().blur();

  cy.get("body").then($b => {
    const hasErr = $b.find(`${sel.errorMsg}:contains("Name")`).length > 0;
    if (!hasErr) cy.get(sel.registerBtn).click();
  });

  cy.get("@name").parents(".form-group").find(sel.errorMsg).contains(required).should("be.visible");

  cy.get("@name").clear().type("Іван").blur();
  cy.get("@name").parents(".form-group").find(sel.errorMsg).contains(invalid).should("be.visible");

  cy.get("@name").clear().type("A").blur();
  cy.get("@name").parents(".form-group").find(sel.errorMsg).contains(tooShortOrLong).should("be.visible");

  cy.get("@name").clear().type("ABCDEFGHIJKLMNOPQRSTUVWXYZ").blur();
  cy.get("@name").parents(".form-group").find(sel.errorMsg).contains(tooShortOrLong).should("be.visible");

  cy.get("@name").clear().type("  John  ").blur();
  cy.get("@name").invoke("val").then(v => expect(String(v).trim()).to.eq("John"));
});

it("Last name field validation", () => {
  const required = /Last name(?:\s+is)?\s+required/i;
  const invalid = /Last name.*invalid/i;

  cy.get(sel.lastName).as("last").focus().blur();

  cy.get("body").then($b => {
    const hasErr = $b.find(`${sel.errorMsg}:contains("Last name")`).length > 0;
    if (!hasErr) cy.get(sel.registerBtn).click();
  });

  cy.get("@last").parents(".form-group").find(sel.errorMsg).contains(required).should("be.visible");

  cy.get("@last").clear().type("Петренко").blur();
  cy.get("@last").parents(".form-group").find(sel.errorMsg).contains(invalid).should("be.visible");

  cy.get("@last").clear().type("B").blur();
  cy.get("@last").parents(".form-group").find(sel.errorMsg).contains(/from 2 to 20/i).should("be.visible");

  cy.get("@last").clear().type("ExtraordinarilyLongLastname").blur();
  cy.get("@last").parents(".form-group").find(sel.errorMsg).contains(/from 2 to 20/i).should("be.visible");

  cy.get("@last").clear().type("  Doe  ").blur();
  cy.get("@last").invoke("val").then(v => expect(String(v).trim()).to.eq("Doe"));
});

it("Email field validation", () => {
  const required = /Email\s+required/i;
  const incorrect = /Email\s+is\s+incorrect/i;

  cy.get(sel.email).as("email").focus().blur();

  cy.get("body").then($b => {
    const hasErr = $b.find(`${sel.errorMsg}:contains("Email")`).length > 0;
    if (!hasErr) cy.get(sel.registerBtn).click();
  });

  cy.get("@email").parents(".form-group").find(sel.errorMsg).contains(required).should("be.visible");

  ["plainaddress","@nouser.com","user@","user@domain","user@.com","user@domain..com"].forEach(bad => {
    cy.get("@email").clear().type(bad).blur();
    cy.get("@email").parents(".form-group").find(sel.errorMsg).contains(incorrect).should("be.visible");
  });

  cy.get("@email").clear().type("john.doe@example.com").blur();
});

it("Password field validation", () => {
  const required = /Password\s+required/i;
  const rule = /Password.*(8\s*to\s*15|8–15).*one.*integer.*one.*capital.*one.*small/i;

  cy.get(sel.password).should('have.length', 1).focus().blur();

  cy.get("body").then($b => {
    const hasErr = $b.find(`${sel.errorMsg}:contains("Password")`).length > 0;
    if (!hasErr) cy.get(sel.registerBtn).click();
  });

  cy.get(sel.password).parents(".form-group").find(sel.errorMsg).contains(required).should("be.visible");

  const bads = ["Short1A","toolongpassword1A","alllowercase1","ALLUPPERCASE1","NoDigitsAA"];
  bads.forEach(p => {
    cy.get(sel.password).clear().type(p).blur(); // re-query каждый раз
    cy.get(sel.password).parents(".form-group").find(sel.errorMsg).contains(rule).should("be.visible");
  });

  cy.get(sel.password).clear().type("Qwerty12").blur();
  cy.get(sel.password).parents(".form-group").find(sel.errorMsg).should("not.exist");
});

it("Re-enter password validation", () => {
  const required = /Re-enter password required/i;
  const mismatch = /Passwords do not match/i;

  cy.get(sel.password).clear().type("Qwerty12");

  cy.get(sel.rePassword).focus().blur();
  cy.get("body").then($b => {
    const hasErr = $b.find(`${sel.errorMsg}:contains("password")`).length > 0;
    if (!hasErr) cy.get(sel.registerBtn).click();
  });

  cy.get(sel.rePassword).parents(".form-group").find(sel.errorMsg).contains(required).should("be.visible");

  cy.get(sel.rePassword).clear().type("Qwerty13").blur();
  cy.get(sel.rePassword).parents(".form-group").find(sel.errorMsg).contains(mismatch).should("be.visible");

  cy.get(sel.rePassword).clear().type("Qwerty12").blur();
  cy.get(sel.rePassword).parents(".form-group").find(sel.errorMsg).should("not.exist");
});
it("Register button should be enabled only with valid data", () => {
    cy.get(sel.name).clear().type("John");
    cy.get(sel.lastName).clear().type("Doe");
    cy.get(sel.email).clear().type("invalid");
    cy.get(sel.password).clear().type("Qwerty12");
    cy.get(sel.rePassword).clear().type("Qwerty12");
    cy.get(sel.registerBtn).should("be.disabled");
    cy.get(sel.email).clear().type(uniqueEmail("john.doe"));
    cy.get(sel.registerBtn).should("not.be.disabled");
  });

  it("Successful registration with unique email", () => {
    const email = uniqueEmail("student");
    cy.get(sel.name).clear().type("John");
    cy.get(sel.lastName).clear().type("Tester");
    cy.get(sel.email).clear().type(email);
    cy.get(sel.password).clear().type("Qwerty12");
    cy.get(sel.rePassword).clear().type("Qwerty12");
    cy.get(sel.registerBtn).should("not.be.disabled").click();
    cy.get(sel.modal).should("not.exist");
    cy.contains(/welcome|garage|profile/i, { timeout: 10000 }).should(
      "be.visible"
    );
  });
});
