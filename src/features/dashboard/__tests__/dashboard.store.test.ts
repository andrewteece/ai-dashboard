import { describe, it, expect, beforeEach } from "vitest";
import { useDashboard } from "../model/dashboard.store";

describe("dashboard store", () => {
  beforeEach(() => {
    // reset persisted layout before each test
    window.localStorage.clear();
    useDashboard.getState().setWidgets([]);
  });

  it("adds and removes widgets", () => {
    const add = useDashboard.getState().addWidget;
    const remove = useDashboard.getState().removeWidget;

    add("kpi");
    add("notes");
    expect(useDashboard.getState().widgets).toHaveLength(2);

    const id = useDashboard.getState().widgets[0].id;
    remove(id);
    expect(useDashboard.getState().widgets).toHaveLength(1);
  });
});
