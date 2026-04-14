import { describe, expect, it } from "@jest/globals";

describe("index", () => {
  it("loads entry module", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    expect(() => require("../index")).not.toThrow();
  });
});
