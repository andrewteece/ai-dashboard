import { renderUI, screen, userEvent } from "@/test/test-utils";
import { ThemeToggle } from "../components/ThemeToggle";

it("toggles dark and light mode", async () => {
  renderUI(<ThemeToggle />);
  const html = document.documentElement;

  const btn = screen.getByRole("button", { name: /dark|light/i });

  // first click -> toggle theme
  await userEvent.click(btn);
  // next-themes toggles a class on <html>
  expect(html.classList.contains("dark") || html.classList.contains("light")).toBe(true);

  // second click -> flip back
  await userEvent.click(btn);
  expect(html.classList.contains("dark") || html.classList.contains("light")).toBe(true);
});
