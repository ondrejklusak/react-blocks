import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders play button", () => {
  render(<App />);
  const button = screen.getByText("Play");
  expect(button).toBeInTheDocument();
});
