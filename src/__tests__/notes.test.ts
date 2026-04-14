import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import type { Express } from "express";

describe("notes API", () => {
  let app: Express;

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    app = require("../index") as Express;
  });

  it("POST /notes returns 400 when body is not an object", async () => {
    const res = await request(app)
      .post("/notes")
      .send("not json")
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Request body must be a JSON object" });
  });

  it("POST /notes returns 400 Missing content when content is absent", async () => {
    const res = await request(app).post("/notes").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing content" });
  });

  it("POST /notes returns 400 Missing content for empty or whitespace content", async () => {
    const empty = await request(app).post("/notes").send({ content: "" });
    expect(empty.status).toBe(400);
    expect(empty.body).toEqual({ error: "Missing content" });

    const ws = await request(app).post("/notes").send({ content: "   \n\t" });
    expect(ws.status).toBe(400);
    expect(ws.body).toEqual({ error: "Missing content" });
  });

  it("POST /notes creates a note with trimmed content", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ content: "  hello  " });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: "1", content: "  hello  " });
  });

  it("PUT /notes/:id returns 404 when note is missing", async () => {
    const res = await request(app)
      .put("/notes/999")
      .send({ content: "x" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Note not found" });
  });

  it("PUT /notes/:id returns 400 Missing content when body lacks valid content", async () => {
    await request(app).post("/notes").send({ content: "seed" });
    const res = await request(app).put("/notes/1").send({ content: "" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing content" });
  });

  it("PUT /notes/:id updates an existing note", async () => {
    await request(app).post("/notes").send({ content: "a" });
    const res = await request(app)
      .put("/notes/1")
      .send({ content: "updated" });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "1", content: "updated" });
  });

  it("DELETE /notes/:id returns 404 when note is missing", async () => {
    const res = await request(app).delete("/notes/42");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Note not found" });
  });

  it("DELETE /notes/:id removes an existing note", async () => {
    await request(app).post("/notes").send({ content: "bye" });
    const del = await request(app).delete("/notes/1");
    expect(del.status).toBe(204);
    const list = await request(app).get("/notes");
    expect(list.body).toEqual([]);
  });
});
