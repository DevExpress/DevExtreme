import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import Button from '@js/ui/button';
import type { Properties } from '@js/ui/html_editor';
import eventsEngine from '@ts/events/core/events_engine';
import ContextMenu from '@ts/ui/context_menu/context_menu';

import HtmlEditor from '../html_editor';
import type { FormatHandlers } from '../types';
import { getFormatHandlers } from '../utils/toolbar_helper';

type FormName = 'cellProperties' | 'tableProperties';

interface EditorState {
  name: string;
  options: Properties;
  caretIndex?: number;
}

const TEXT_MARKUP = '<p>text</p>';
const TABLE_MARKUP = `${TEXT_MARKUP}<table><tbody><tr><td>cell</td></tr></tbody></table>`;
const CARET_IN_TEXT = 1;
const CARET_IN_CELL = 6;
const FORM_NAMES: FormName[] = ['cellProperties', 'tableProperties'];
const MENU_ITEM_TEXTS: Record<FormName, string> = {
  cellProperties: 'Cell Properties',
  tableProperties: 'Table Properties',
};

const STATES_WITHOUT_TABLE: EditorState[] = [
  { name: 'the editor has no table', options: { value: TEXT_MARKUP } },
  {
    name: 'the editor has no table and the caret is in the text',
    options: { value: TEXT_MARKUP },
    caretIndex: CARET_IN_TEXT,
  },
];

const STATES_OUTSIDE_TABLE: EditorState[] = [
  { name: 'nothing is selected', options: { value: TABLE_MARKUP } },
  {
    name: 'the caret is outside the table',
    options: { value: TABLE_MARKUP },
    caretIndex: CARET_IN_TEXT,
  },
  {
    name: 'the editor is read-only and nothing is selected',
    options: { value: TABLE_MARKUP, readOnly: true },
  },
];

const STATE_IN_CELL: EditorState = {
  name: 'the caret is in a table cell',
  options: { value: TABLE_MARKUP },
  caretIndex: CARET_IN_CELL,
};

const EMPTY_RECT: DOMRect = {
  x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => ({}),
};

const editors: HtmlEditor[] = [];

const createEditor = ({ options, caretIndex }: EditorState): HtmlEditor => {
  const $element = $('<div>').appendTo(document.body);
  const editor: HtmlEditor = new HtmlEditor($element, {
    tableContextMenu: { enabled: true },
    toolbar: {
      items: FORM_NAMES.map((name) => ({ name, options: { disabled: false } })),
    },
    ...options,
  });

  editors.push(editor);

  if (caretIndex !== undefined) {
    editor.getQuillInstance().setSelection(caretIndex, 0);
    jest.runAllTimers();
  }

  return editor;
};

const getHandler = (editor: HtmlEditor, formName: FormName): FormatHandlers[FormName] => {
  const toolbarModule = editor.getModule<Parameters<typeof getFormatHandlers>[0]>('toolbar');

  if (!toolbarModule) {
    throw new Error('The toolbar module is not created');
  }

  return getFormatHandlers(toolbarModule)[formName];
};

const getToolbarButton = (editor: HtmlEditor, formName: FormName): Button => {
  const element = editor
    .$element()
    .find('.dx-htmleditor-toolbar .dx-button')
    .get(FORM_NAMES.indexOf(formName));

  return Button.getInstance(element) as Button;
};

const clickToolbarButton = (editor: HtmlEditor, formName: FormName): void => {
  eventsEngine.trigger(getToolbarButton(editor, formName).element(), 'dxclick');
  jest.runAllTimers();
};

const clickContextMenuItem = (
  editor: HtmlEditor,
  formName: FormName,
  caretIndex?: number,
): void => {
  eventsEngine.trigger(editor.$element().find('td'), 'dxcontextmenu');
  jest.runAllTimers();

  if (caretIndex !== undefined) {
    // jsdom may move the selection into the focused menu, a browser keeps it in the editor
    const [leaf, offset] = editor.getQuillInstance().getLeaf(caretIndex);

    document.getSelection()?.collapse(leaf.domNode, offset);
  }

  const menuElement = editor.$element().children('.dx-has-context-menu').get(0);
  const item = ContextMenu.getInstance<ContextMenu>(menuElement)
    .itemsContainer()
    .find('.dx-menu-item')
    .toArray()
    .find((element) => $(element).text() === MENU_ITEM_TEXTS[formName]);

  eventsEngine.trigger(item, 'dxclick');
  jest.runAllTimers();
};

const getTargetElement = (editor: HtmlEditor, formName: FormName): ReturnType<typeof $> => editor
  .$element()
  .find(formName === 'cellProperties' ? 'td' : 'table');

const isFormShown = (editor: HtmlEditor): boolean => {
  const { visible } = editor._formDialog._popup.option();

  return Boolean(visible);
};

describe('HtmlEditor cell and table properties forms', () => {
  const originalGetBoundingClientRect = Range.prototype.getBoundingClientRect;

  beforeEach(() => {
    jest.useFakeTimers();
    fx.off = true;
    // jsdom has no layout for a Range, and Quill reads it when the selection is set
    Range.prototype.getBoundingClientRect = (): DOMRect => EMPTY_RECT;
  });

  afterEach(() => {
    editors.forEach((editor) => { editor.dispose(); });
    editors.length = 0;
    document.body.innerHTML = '';
    Range.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    fx.off = false;
    jest.useRealTimers();
  });

  describe.each(FORM_NAMES)('%s', (formName) => {
    describe.each([...STATES_WITHOUT_TABLE, ...STATES_OUTSIDE_TABLE])('$name', (state) => {
      it('keeps the toolbar button disabled', () => {
        const editor = createEditor(state);

        expect(getToolbarButton(editor, formName).option('disabled')).toBe(true);
      });

      it('shows no form on a click on the toolbar button that its own API enabled', () => {
        const editor = createEditor(state);

        getToolbarButton(editor, formName).option('disabled', false);

        expect(() => { clickToolbarButton(editor, formName); }).not.toThrow();
        expect(isFormShown(editor)).toBe(false);
      });

      it('shows no form when the handler is called without arguments', () => {
        const editor = createEditor(state);
        const handler = getHandler(editor, formName);

        expect(() => { handler(); }).not.toThrow();
        expect(isFormShown(editor)).toBe(false);
      });

      it('shows no form when the handler gets a click event', () => {
        const editor = createEditor(state);
        const handler = getHandler(editor, formName);

        expect(() => { handler({ event: undefined }); }).not.toThrow();
        expect(isFormShown(editor)).toBe(false);
      });

      it('shows no form when the handler gets an empty element', () => {
        const editor = createEditor(state);
        const handler = getHandler(editor, formName);

        expect(() => { handler($()); }).not.toThrow();
        expect(isFormShown(editor)).toBe(false);
      });
    });

    describe(STATE_IN_CELL.name, () => {
      it('enables the toolbar button and shows the form on a click on it', () => {
        const editor = createEditor(STATE_IN_CELL);

        expect(getToolbarButton(editor, formName).option('disabled')).toBe(false);

        clickToolbarButton(editor, formName);

        expect(isFormShown(editor)).toBe(true);
      });

      it('shows the form when the handler is called without arguments', () => {
        const editor = createEditor(STATE_IN_CELL);

        getHandler(editor, formName)();
        jest.runAllTimers();

        expect(isFormShown(editor)).toBe(true);
      });

      it('shows the form when the handler gets a click event', () => {
        const editor = createEditor(STATE_IN_CELL);

        getHandler(editor, formName)({ event: undefined });
        jest.runAllTimers();

        expect(isFormShown(editor)).toBe(true);
      });

      it('shows the form when the handler gets the element', () => {
        const editor = createEditor(STATE_IN_CELL);

        getHandler(editor, formName)(getTargetElement(editor, formName));
        jest.runAllTimers();

        expect(isFormShown(editor)).toBe(true);
      });

      it('shows the form on a click on the context menu item', () => {
        const editor = createEditor(STATE_IN_CELL);

        clickContextMenuItem(editor, formName, STATE_IN_CELL.caretIndex);

        expect(isFormShown(editor)).toBe(true);
      });
    });
  });

  describe.each(STATES_OUTSIDE_TABLE)('cellProperties for a cell, $name', (state) => {
    it('shows no form when the handler gets the cell', () => {
      const editor = createEditor(state);
      const handler = getHandler(editor, 'cellProperties');
      const $cell = getTargetElement(editor, 'cellProperties');

      expect(() => { handler($cell); }).not.toThrow();
      expect(isFormShown(editor)).toBe(false);
    });

    it('shows no form on a click on the context menu item', () => {
      const editor = createEditor(state);

      expect(() => { clickContextMenuItem(editor, 'cellProperties'); }).not.toThrow();
      expect(isFormShown(editor)).toBe(false);
    });
  });

  describe.each(STATES_OUTSIDE_TABLE)('tableProperties for a table, $name', (state) => {
    it('shows the form when the handler gets the table', () => {
      const editor = createEditor(state);

      getHandler(editor, 'tableProperties')(getTargetElement(editor, 'tableProperties'));
      jest.runAllTimers();

      expect(isFormShown(editor)).toBe(true);
    });

    it('shows the form on a click on the context menu item', () => {
      const editor = createEditor(state);

      clickContextMenuItem(editor, 'tableProperties');

      expect(isFormShown(editor)).toBe(true);
    });
  });
});
