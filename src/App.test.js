import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders app title", () => {
  render(<App />);
  const title = screen.getByText(/Street Vendor Poster Generator/i);
  expect(title).toBeInTheDocument();
});
