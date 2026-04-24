import { describe, expect, it } from "vitest";
import HomePage from "../app/page";

describe("HomePage", () => {
  it("returns a React tree", () => {
    const page = HomePage();
    expect(page).toBeTruthy();
  });
});
