import { renderUI, screen, userEvent } from "@/test/test-utils";
import { axe } from "jest-axe";
import { ThemeToggle } from "../components/ThemeToggle";

it("has no obvious accessibility violations (light & dark)", async () => {
  const { container } = renderUI(<ThemeToggle />);

  // initial state
  expect(await axe(container)).toHaveNoViolations();

  // toggle once and re-check
  const btn = screen.getByRole("button", { name: /dark|light/i });
  await userEvent.click(btn);
  expect(await axe(container)).toHaveNoViolations();
});
