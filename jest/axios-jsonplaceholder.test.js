const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com";
const api = axios.create({ baseURL: BASE_URL });

function withAbort(ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("Test timeout"), ms);
  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timer),
  };
}

describe("JSONPlaceholder API tests with axios + AbortController", () => {
  test("GET /posts should return list of posts", async () => {
    const { signal, cancel } = withAbort();
    const response = await api.get("/posts", { signal });
    cancel();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toHaveProperty("id");
    expect(response.data[0]).toHaveProperty("title");
  });

  test("GET /posts/1 should return single post", async () => {
    const { signal, cancel } = withAbort();
    const response = await api.get("/posts/1", { signal });
    cancel();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("id", 1);
    expect(response.data).toHaveProperty("userId");
    expect(response.data).toHaveProperty("title");
    expect(response.data).toHaveProperty("body");
  });

  test("POST /posts should create new post", async () => {
    const { signal, cancel } = withAbort();
    const newPost = { title: "foo", body: "bar", userId: 1 };
    const response = await api.post("/posts", newPost, { signal });
    cancel();
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(newPost);
    expect(response.data).toHaveProperty("id");
  });

  test("GET /users should return list of users", async () => {
    const { signal, cancel } = withAbort();
    const response = await api.get("/users", { signal });
    cancel();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toHaveProperty("id");
    expect(response.data[0]).toHaveProperty("email");
  });

  test("POST /comments should create new comment", async () => {
    const { signal, cancel } = withAbort();
    const newComment = {
      postId: 1,
      name: "tester",
      email: "test@example.com",
      body: "nice post!",
    };
    const response = await api.post("/comments", newComment, { signal });
    cancel();
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(newComment);
    expect(response.data).toHaveProperty("id");
  });

  test("should cancel a request if it exceeds the timeout", async () => {
    const { signal, cancel } = withAbort(1);
    await expect(api.get("/posts", { signal })).rejects.toMatchObject({
      code: "ERR_CANCELED",
    });
    cancel();
  });
});
