import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import TextEditor from '../text_editor';
import type { TextEditorBaseProperties } from '../text_editor.base';

class ProbeTextEditor extends TextEditor {
  public hasButtonCollectionOnInitMarkup?: boolean;

  _initMarkup(): void {
    this.hasButtonCollectionOnInitMarkup = Boolean(this._buttonCollection);

    super._initMarkup();
  }
}

const editors: ProbeTextEditor[] = [];

const createEditor = (options: Partial<TextEditorBaseProperties> = {}): ProbeTextEditor => {
  const element = $('<div>').appendTo(document.body).get(0) as HTMLElement;
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance: ProbeTextEditor = new ProbeTextEditor(element, options);

  editors.push(instance);

  return instance;
};

const customButton: NonNullable<TextEditorBaseProperties['buttons']> = [
  { name: 'custom', location: 'after', options: { text: 'Go' } },
];

describe('TextEditorBase buttons initialization', () => {
  afterEach(() => {
    editors.forEach((instance) => instance.dispose());
    editors.length = 0;
    document.body.innerHTML = '';
  });

  it('creates the button collection before the markup is rendered', () => {
    const instance = createEditor();

    expect(instance.hasButtonCollectionOnInitMarkup).toBe(true);
  });

  it('renders a button declared in the buttons option', () => {
    const instance = createEditor({ buttons: customButton });

    expect(instance.getButton('custom')).toBeDefined();
    expect(instance._$afterButtonsContainer).not.toBeNull();
  });

  it('renders the declared button again after repaint', () => {
    const instance = createEditor({ buttons: customButton });

    instance.repaint();

    expect(instance.getButton('custom')).toBeDefined();
  });

  it('throws E1053 when the buttons option is not an array', () => {
    expect(() => createEditor({
      buttons: 'custom' as unknown as TextEditorBaseProperties['buttons'],
    })).toThrow(/E1053/);
  });
});
