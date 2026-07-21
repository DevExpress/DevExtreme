import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { HtmlEditorModel } from '@ts/ui/__tests__/__mock__/model/html_editor';

import HtmlEditor from '../html_editor';

jest.mock('@ts/core/utils/m_selectors', () => ({
  ...jest.requireActual<typeof import('@ts/core/utils/m_selectors')>('@ts/core/utils/m_selectors'),
  isElementVisible: jest.fn(() => true),
}));

const editors: HtmlEditor[] = [];

const createEditor = (options = {}): HtmlEditorModel => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error direct instantiation is not typed
  const instance = new HtmlEditor($element, options);

  editors.push(instance);

  return new HtmlEditorModel($element.get(0) as HTMLElement);
};

describe('HtmlEditor focus escape (Ctrl+Shift+Up/Down)', () => {
  afterEach(() => {
    editors.forEach((instance) => instance.dispose());
    editors.length = 0;
    document.body.innerHTML = '';
  });

  it('Ctrl+Shift+Down moves focus to the next focusable outside the editor', () => {
    const before = $('<button>').attr('id', 'before').appendTo(document.body).get(0) as HTMLElement;
    const model = createEditor();
    const after = $('<button>').attr('id', 'after').appendTo(document.body).get(0) as HTMLElement;

    model.moveFocusFromContent('down');

    expect(document.activeElement).toBe(after);
    expect(document.activeElement).not.toBe(before);
  });

  it('Ctrl+Shift+Up moves focus to the previous focusable outside the editor', () => {
    const before = $('<button>').attr('id', 'before').appendTo(document.body).get(0) as HTMLElement;
    const model = createEditor();
    $('<button>').attr('id', 'after').appendTo(document.body);

    model.moveFocusFromContent('up');

    expect(document.activeElement).toBe(before);
  });

  it('Ctrl+Shift+Up moves focus into the toolbar when it is present', () => {
    $('<button>').attr('id', 'before').appendTo(document.body);
    const model = createEditor({ toolbar: { items: ['bold'] } });

    model.moveFocusFromContent('up');

    const activeElement = document.activeElement as HTMLElement;
    expect(model.getToolbarWrapper()?.contains(activeElement)).toBe(true);
  });

  it('Ctrl+Shift+Up falls back to the previous focusable when the toolbar has no focusable item', () => {
    const before = $('<button>').attr('id', 'before').appendTo(document.body).get(0) as HTMLElement;
    const model = createEditor({ readOnly: true, toolbar: { items: ['bold'] } });

    model.moveFocusFromContent('up');

    expect(document.activeElement).toBe(before);
  });

  it('prevents the browser default on Ctrl+Shift+ArrowDown', () => {
    $('<button>').attr('id', 'after').appendTo(document.body);
    const model = createEditor();

    const event = model.moveFocusFromContent('down');

    expect(event.defaultPrevented).toBe(true);
  });

  it('does nothing without Ctrl+Shift modifiers', () => {
    const before = $('<button>').attr('id', 'before').appendTo(document.body).get(0) as HTMLElement;
    const model = createEditor();
    const after = $('<button>').attr('id', 'after').appendTo(document.body).get(0) as HTMLElement;

    const event = model.pressKeyInContent('ArrowDown');

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(after);
    expect(document.activeElement).not.toBe(before);
  });

  it('does not react to other Ctrl+Shift key combinations', () => {
    const model = createEditor();
    $('<button>').attr('id', 'after').appendTo(document.body);

    const event = model.pressKeyInContent('ArrowLeft', { ctrlKey: true, shiftKey: true });

    expect(event.defaultPrevented).toBe(false);
  });
});

describe('HtmlEditor Tab key handling (inlineTabInsertion)', () => {
  afterEach(() => {
    editors.forEach((instance) => instance.dispose());
    editors.length = 0;
    document.body.innerHTML = '';
  });

  it('should not paste the /t symbol in editor on Tab keypress by default', () => {
    const model = createEditor();
    const quill = model.getQuillInstance();
    model.setQuillFocus();

    expect(quill.getText()).not.toContain('\t');

    const event = model.pressKeyInContent('Tab');

    expect(event.defaultPrevented).toBe(false);
    expect(quill.getText()).not.toContain('\t');
  });

  it('should insert a tab character on Tab keypress when inlineTabInsertion is enabled', () => {
    const model = createEditor({
      customizeModules: (modules) => {
        modules.keyboard.inlineTabInsertion = true;
      },
    });
    const quill = model.getQuillInstance();
    model.setQuillFocus();

    expect(quill.getText()).not.toContain('\t');
    const event = model.pressKeyInContent('Tab');

    expect(event.defaultPrevented).toBe(true);
    expect(quill.getText()).toContain('\t');
  });
});
