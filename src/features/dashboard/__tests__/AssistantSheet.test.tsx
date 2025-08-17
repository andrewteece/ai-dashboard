import { fireEvent, render, screen, within } from '@testing-library/react';
import AssistantSheet from '../components/AssistantSheet';

describe('AssistantSheet', () => {
  it('opens, sends prompt, and shows assistant reply (MSW JSON fallback)', async () => {
    render(<AssistantSheet />);

    // open sheet
    const trigger = screen.getByRole('button', { name: /open assistant/i });
    fireEvent.click(trigger);

    // type prompt
    const textarea = await screen.findByRole('textbox', { name: /prompt/i });
    fireEvent.change(textarea, { target: { value: 'Hello!' } });

    // send
    const sendBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendBtn);

    // assistant block should appear with our MSW echo
    const assistantBlocks = await screen.findAllByText(/echo:/i);
    expect(assistantBlocks.length).toBeGreaterThan(0);

    // Make sure most recent assistant message contains the prompt
    const last = assistantBlocks[assistantBlocks.length - 1];
    expect(within(last.parentElement as HTMLElement).getByText(/hello!/i)).toBeInTheDocument();
  });
});
