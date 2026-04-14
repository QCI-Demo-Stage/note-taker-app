/**
 * Integration tests for notes CRUD API and CORS.
 */

const request = require("supertest");
const { app } = require("../src/index");
const noteStore = require("../src/models/noteStore");

describe("Notes API", () => {
  beforeEach(() => {
    noteStore.reset();
  });

  describe("CORS", () => {
    it("allows any origin via Access-Control-Allow-Origin", async () => {
      const res = await request(app)
        .options("/notes")
        .set("Origin", "http://localhost:5173")
        .set("Access-Control-Request-Method", "GET");

      expect(res.headers["access-control-allow-origin"]).toBe("*");
    });
  });

  describe("POST /notes", () => {
    it("creates a note and returns 201 with id and content", async () => {
      const res = await request(app)
        .post("/notes")
        .send({ content: "hello" })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.body).toMatchObject({
        id: "1",
        content: "hello",
      });
    });

    it("returns 400 when body is not a JSON object", async () => {
      const res = await request(app)
        .post("/notes")
        .send([1, 2])
        .expect(400);

      expect(res.body).toEqual({
        error: "Request body must be a JSON object",
      });
    });

    it("returns 400 when content is missing or not a string", async () => {
      const missing = await request(app)
        .post("/notes")
        .send({})
        .expect(400);
      expect(missing.body).toEqual({
        error: 'Field "content" must be a string',
      });

      const wrongType = await request(app)
        .post("/notes")
        .send({ content: 123 })
        .expect(400);
      expect(wrongType.body).toEqual({
        error: 'Field "content" must be a string',
      });
    });
  });

  describe("GET /notes", () => {
    it("returns 200 and an empty array when there are no notes", async () => {
      const res = await request(app).get("/notes").expect(200);
      expect(res.body).toEqual([]);
    });

    it("returns 200 and all notes", async () => {
      await request(app).post("/notes").send({ content: "a" });
      await request(app).post("/notes").send({ content: "b" });

      const res = await request(app).get("/notes").expect(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({ id: "1", content: "a" });
      expect(res.body[1]).toMatchObject({ id: "2", content: "b" });
    });
  });

  describe("PUT /notes/:id", () => {
    it("updates a note and returns 200", async () => {
      await request(app).post("/notes").send({ content: "old" });

      const res = await request(app)
        .put("/notes/1")
        .send({ content: "new" })
        .expect(200);

      expect(res.body).toMatchObject({ id: "1", content: "new" });
    });

    it("returns 404 when note does not exist", async () => {
      const res = await request(app)
        .put("/notes/999")
        .send({ content: "x" })
        .expect(404);

      expect(res.body).toEqual({ error: "Note not found" });
    });

    it("returns 400 when body is not a JSON object", async () => {
      await request(app).post("/notes").send({ content: "x" });
      const res = await request(app)
        .put("/notes/1")
        .set("Content-Type", "application/json")
        .send("[]")
        .expect(400);

      expect(res.body).toEqual({
        error: "Request body must be a JSON object",
      });
    });

    it("returns 400 when content is present but not a string", async () => {
      await request(app).post("/notes").send({ content: "x" });
      const res = await request(app)
        .put("/notes/1")
        .send({ content: null })
        .expect(400);

      expect(res.body).toEqual({
        error: 'Field "content" must be a string',
      });
    });
  });

  describe("DELETE /notes/:id", () => {
    it("deletes a note and returns 204", async () => {
      await request(app).post("/notes").send({ content: "bye" });

      await request(app).delete("/notes/1").expect(204);

      const list = await request(app).get("/notes").expect(200);
      expect(list.body).toEqual([]);
    });

    it("returns 404 when note does not exist", async () => {
      const res = await request(app).delete("/notes/42").expect(404);
      expect(res.body).toEqual({ error: "Note not found" });
    });
  });
});
