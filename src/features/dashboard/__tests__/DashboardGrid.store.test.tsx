import { renderUI, screen } from "@/test/test-utils";
import { waitFor } from "@testing-library/react";
import { DashboardGrid } from "../components/DashboardGrid";
import { useDashboard } from "../model/dashboard.store";

beforeEach(() => {
  window.localStorage.clear();
  useDashboard.getState().setWidgets([
    { id: "kpi-1", type: "kpi", title: "KPI Overview" },
    { id: "line-1", type: "line", title: "Traffic" },
    { id: "notes-1", type: "notes", title: "Notes" },
  ]);
});

it("renders a drag handle for every widget", async () => {
  renderUI(<DashboardGrid />);
  const handles = await screen.findAllByRole("button", { name: /drag to reorder/i });
  expect(handles).toHaveLength(3);
});

it("re-renders in new order when the store changes", async () => {
  renderUI(<DashboardGrid />);

  const titles = () => screen.getAllByRole("heading").map((h) => h.textContent);
  const before = titles();

  // simulate what DnD does: change the order in the store
  useDashboard
    .getState()
    .setWidgets([
      { id: "line-1", type: "line", title: "Traffic" },
      { id: "kpi-1", type: "kpi", title: "KPI Overview" },
      { id: "notes-1", type: "notes", title: "Notes" },
    ]);

  await waitFor(() => {
    const after = titles();
    expect(after).not.toEqual(before);
    expect(after[0]).toBe("Traffic");
  });
});
