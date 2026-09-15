import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("test toolchain", () => {
  it("renders a React element in jsdom with jest-dom matchers", () => {
    render(<h1>hello</h1>);
    expect(screen.getByRole("heading", { name: "hello" })).toBeInTheDocument();
  });
});
