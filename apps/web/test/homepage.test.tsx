import React from "react";
import { describe, expect, it } from "vitest";
import HomePage from "../app/page";

describe("HomePage", () => {
  it("returns a React tree", () => {
    const page = HomePage();
    expect(React.isValidElement(page)).toBe(true);
  });
});
