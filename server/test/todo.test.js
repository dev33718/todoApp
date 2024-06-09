const request = require("supertest");
const app = require("../index");

describe("Todo API Endpoints", () => {
  it("should create a new todo", async () => {
    const res = await request(app)
      .post("/todos")
      .send({
        description: "Test Todo"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("description", "Test Todo");
  });

  it("should get all todos", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should get a specific todo", async () => {
    // Assuming there is at least one todo in the database
    const todosRes = await request(app).get("/todos");
    const todoId = todosRes.body[0].todo_id;
    const res = await request(app).get(`/todos/${todoId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("todo_id", todoId);
  });
});