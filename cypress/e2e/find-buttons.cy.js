describe("queries", () => {
  beforeEach(() => {
    cy.visit("https://qauto.forstudy.space", {
      auth: { username: "guest", password: "welcome2qauto" },
    });
  });

  it("About button exists and is clickable", () => {
    cy.get('button.btn.header-link[appscrollto="aboutSection"]')
      .should("exist")
      .and("be.visible")
      .click({ force: true });
  });

  it("Contacts button exists and is clickable", () => {
    cy.get('button.btn.header-link[appscrollto="contactsSection"]')
      .should("exist")
      .and("be.visible")
      .click({ force: true });
  });

  it("Sign In button exists and is clickable", () => {
    cy.get("button.header_signin")
      .should("exist")
      .and("be.visible")
      .click({ force: true });

    cy.get(".modal-content").should("be.visible");
  });

  it("Guest log in button exists and is clickable", () => {
    cy.get("button.header-link.-guest")
      .should("exist")
      .and("be.visible")
      .click({ force: true });
  });

  it("ithillel.ua link exists and is clickable", () => {
    cy.get("a.contacts_link.display-4")
      .should("exist")
      .and("have.attr", "href", "https://ithillel.ua")
      .and("be.visible")
      .click({ force: true });
  });

  it("Facebook link exists", () => {
    cy.get('a.socials_link[href*="facebook.com"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "target", "_blank");
  });

  it("Telegram link exists", () => {
    cy.get('a.socials_link[href*="t.me"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "target", "_blank");
  });

  it("YouTube link exists", () => {
    cy.get('a.socials_link[href*="youtube.com"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "target", "_blank");
  });

  it("Instagram link exists", () => {
    cy.get('a.socials_link[href*="instagram.com"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "target", "_blank");
  });

  it("LinkedIn link exists", () => {
    cy.get('a.socials_link[href*="linkedin.com"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "target", "_blank");
  });
});
