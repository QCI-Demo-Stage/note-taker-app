import request from "supertest";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../models/noteStore");

type MockedNoteStore = {
  getAll: jest.Mock<() => unknown[]>;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const noteStore = require("../models/noteStore") as MockedNoteStore;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { app } = require("../index");

describe("GET /notes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    noteStore.getAll.mockReturnValue([]);
  });

  it("returns 200 and an array when the datastore is empty", async () => {
    const res = await request(app).get("/notes").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
    expect(noteStore.getAll).toHaveBeenCalled();
  });

  it("responds with 500 when the data layer throws", async () => {
    noteStore.getAll.mockImplementation(() => {
      throw new Error("boom");
    });

    await request(app).get("/notes").expect(500);
  });
});
