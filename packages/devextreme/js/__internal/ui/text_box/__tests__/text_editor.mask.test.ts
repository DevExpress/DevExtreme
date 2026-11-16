import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties } from '@js/ui/text_box';
import TextBox from '@js/ui/text_box';

interface ClipboardDataMock {
  getData: jest.Mock<(format: string) => string>;
  setData: jest.Mock<(format: string, data: string) => void>;
}

const textBoxes: TextBox[] = [];
const uncaughtErrors: string[] = [];

const collectUncaughtError = (event: ErrorEvent): void => {
  uncaughtErrors.push(event.message);
  event.preventDefault();
};

const createMaskedInput = (): { textBox: TextBox; input: HTMLInputElement } => {
  const element = document.body.appendChild(document.createElement('div'));
  const options: Properties = { mask: '000-000', value: '123456' };
  const textBox = new TextBox(element, options);
  textBoxes.push(textBox);

  const input = element.querySelector<HTMLInputElement>('.dx-texteditor-input');
  if (!input) {
    throw new Error('The input is not rendered');
  }

  return { textBox, input };
};

const createClipboardData = (content: string): ClipboardDataMock => ({
  getData: jest.fn((): string => content),
  setData: jest.fn(),
});

const cut = (input: HTMLInputElement, clipboardData: ClipboardDataMock): Event => {
  const event = new Event('cut', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', { value: clipboardData });
  input.dispatchEvent(event);

  return event;
};

describe('TextBox with a mask: cut', () => {
  beforeEach(() => {
    window.addEventListener('error', collectUncaughtError);
  });

  afterEach(() => {
    window.removeEventListener('error', collectUncaughtError);
    uncaughtErrors.length = 0;
    textBoxes.forEach((textBox) => textBox.dispose());
    textBoxes.length = 0;
    document.body.innerHTML = '';
  });

  it('does not read the clipboard data on a cut with an empty selection', () => {
    const { textBox, input } = createMaskedInput();
    const clipboardData = createClipboardData('abc');
    input.setSelectionRange(2, 2);

    const event = cut(input, clipboardData);

    expect(uncaughtErrors).toEqual([]);
    expect(event.defaultPrevented).toBe(true);
    expect(clipboardData.getData).not.toHaveBeenCalled();
    expect(clipboardData.setData).not.toHaveBeenCalled();
    expect(input.value).toBe('123-456');
    expect(textBox.option('value')).toBe('123456');
  });

  it('puts the selected text into the clipboard data and clears it in the input', () => {
    const { input } = createMaskedInput();
    const clipboardData = createClipboardData('');
    input.setSelectionRange(0, 2);

    const event = cut(input, clipboardData);

    expect(uncaughtErrors).toEqual([]);
    expect(event.defaultPrevented).toBe(true);
    expect(clipboardData.setData).toHaveBeenCalledWith('Text', '12');
    expect(input.value).toBe('__3-456');
  });
});
