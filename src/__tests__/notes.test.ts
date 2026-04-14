import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";

const mockGetAll = jest.fn(() => [] as Array<Record<string, unknown>>);

jest.mock("../models/noteStore", () => ({
  __esModule: true,
  getAll: () => mockGetAll(),
}));

describe("GET /notes", () => {
  let app: import("express").Express;

  beforeEach(() => {
    jest.resetModules();
    mockGetAll.mockReset();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ app } = require("../index") as { app: import("express").Express });
  });

  it("returns 200 and an empty array when the datastore is empty", async () => {
    mockGetAll.mockReturnValue([]);

    const res = await request(app).get("/notes");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
  });

  it("returns 500 when the data layer throws", async () => {
    mockGetAll.mockImplementation(() => {
      throw new Error("store failure");
    });

    const res = await request(app).get("/notes");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
  });
});
