import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "@/core/theme/theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export function renderUI(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}
