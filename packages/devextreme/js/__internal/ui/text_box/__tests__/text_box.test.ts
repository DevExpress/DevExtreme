import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import TextBox, { type TextBoxProperties } from '../text_box';

const textBoxes: TextBox[] = [];

const createTextBox = (options: Partial<TextBoxProperties> = {}): TextBox => {
  const element = $('<div>').appendTo(document.body).get(0) as HTMLElement;
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance: TextBox = new TextBox(element, options);

  textBoxes.push(instance);

  return instance;
};

describe('TextBox search mode and the clear button', () => {
  afterEach(() => {
    textBoxes.forEach((instance) => instance.dispose());
    textBoxes.length = 0;
    document.body.innerHTML = '';
  });

  it('turns the clear button on in search mode when showClearButton is not specified', () => {
    const instance = createTextBox({ mode: 'search' });

    expect(instance.option('showClearButton')).toBe(true);
  });

  it('keeps showClearButton disabled in search mode when it is specified explicitly (T218573)', () => {
    const instance = createTextBox({ mode: 'search', showClearButton: false });

    expect(instance.option('showClearButton')).toBe(false);
  });

  it('restores the original showClearButton when search mode is turned off', () => {
    const instance = createTextBox({ mode: 'search' });

    expect(instance.option('showClearButton')).toBe(true);

    instance.option('mode', 'text');

    expect(instance.option('showClearButton')).toBe(false);
  });
});
