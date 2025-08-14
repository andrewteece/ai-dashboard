import { renderUI, screen, userEvent } from "@/test/test-utils";
import AssistantSheet from "../components/AssistantSheet";

it("sends a prompt and shows the assistant echo", async () => {
  renderUI(<AssistantSheet />);

  // Open the sheet
  await userEvent.click(screen.getByRole("button", { name: /ask ai/i }));
  // Ensure the sheet is open by checking its heading specifically
  await screen.findByRole("heading", { name: /ai assistant/i });

  // Type a prompt and send
  await userEvent.type(screen.getByPlaceholderText(/write your prompt/i), "hello");
  await userEvent.click(screen.getByRole("button", { name: /send/i }));

  // Assert on the unique content rather than a generic "assistant" label
  await screen.findByText(/echo:\s*hello/i);

  // (Optional) If you want to verify the role label exists, allow multiple matches:
  const roleLabels = screen.getAllByText(/^assistant$/i);
  expect(roleLabels.length).toBeGreaterThan(0);
});
