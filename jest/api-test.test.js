const axios = require('axios');

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("JSONPlaceholder API tests with axios", () => {
  test("GET /posts should return list of posts", async () => {
    const response = await axios.get(`${BASE_URL}/posts`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toHaveProperty("id");
    expect(response.data[0]).toHaveProperty("title");
  });

  test("GET /posts/1 should return single post", async () => {
    const response = await axios.get(`${BASE_URL}/posts/1`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("id", 1);
    expect(response.data).toHaveProperty("userId");
    expect(response.data).toHaveProperty("title");
    expect(response.data).toHaveProperty("body");
  });

  test("POST /posts should create new post", async () => {
    const newPost = { title: "foo", body: "bar", userId: 1 };
    const response = await axios.post(`${BASE_URL}/posts`, newPost);
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(newPost);
    expect(response.data).toHaveProperty("id"); // JSONPlaceholder завжди додає id
  });

  test("GET /users should return list of users", async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toHaveProperty("id");
    expect(response.data[0]).toHaveProperty("email");
  });

  test("POST /comments should create new comment", async () => {
    const newComment = {
      postId: 1,
      name: "tester",
      email: "test@example.com",
      body: "nice post!",
    };
    const response = await axios.post(`${BASE_URL}/comments`, newComment);
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(newComment);
    expect(response.data).toHaveProperty("id");
  });
});