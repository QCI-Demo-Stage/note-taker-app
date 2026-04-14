import { beforeEach, describe, expect, it, jest } from "@jest/globals";

type NoteStore = {
  getAll: () => Array<Record<string, unknown>>;
  create: (note: Record<string, unknown>) => Record<string, unknown>;
  update: (
    id: string | number,
    note: Record<string, unknown>,
  ) => Record<string, unknown> | null;
  remove: (id: string | number) => boolean;
};

describe("noteStore", () => {
  let noteStore: NoteStore;

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    noteStore = require("../models/noteStore") as NoteStore;
  });

  it("getAll returns empty list initially", () => {
    expect(noteStore.getAll()).toEqual([]);
  });

  it("create assigns id and stores note", () => {
    const created = noteStore.create({ title: "a", body: "b" });
    expect(created.id).toBe("1");
    expect(created.title).toBe("a");
    expect(created.body).toBe("b");
    expect(noteStore.getAll()).toEqual([created]);
  });

  it("create uses id-only record when input is not an object", () => {
    const created = noteStore.create(null as unknown as Record<string, unknown>);
    expect(created.id).toBe("1");
    expect(Object.keys(created)).toEqual(["id"]);
  });

  it("update merges fields and preserves id", () => {
    noteStore.create({ title: "t" });
    const updated = noteStore.update("1", { body: "x" });
    expect(updated).toEqual({ id: "1", title: "t", body: "x" });
  });

  it("update returns null when id is missing", () => {
    expect(noteStore.update("99", { a: 1 })).toBeNull();
  });

  it("update keeps existing fields when note is not an object", () => {
    noteStore.create({ title: "t" });
    const updated = noteStore.update("1", null as unknown as Record<string, unknown>);
    expect(updated).toEqual({ id: "1", title: "t" });
  });

  it("remove deletes by id and returns boolean", () => {
    noteStore.create({});
    expect(noteStore.remove("1")).toBe(true);
    expect(noteStore.getAll()).toEqual([]);
    expect(noteStore.remove("1")).toBe(false);
  });
});
