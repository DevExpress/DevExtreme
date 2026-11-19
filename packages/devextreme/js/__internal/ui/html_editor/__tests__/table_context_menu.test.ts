import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import type { dxHtmlEditorTableContextMenu, Properties } from '@js/ui/html_editor';
import eventsEngine from '@ts/events/core/events_engine';
import ContextMenu from '@ts/ui/context_menu/context_menu';

import HtmlEditor from '../html_editor';

type MenuItems = NonNullable<dxHtmlEditorTableContextMenu['items']>;

interface MenuShape {
  name: string;
  createItems: () => MenuItems;
  commandPath: string[];
}

interface RuntimeChange {
  name: string;
  createEditor: (items: MenuItems, createOtherItems: () => MenuItems) => HtmlEditor;
}

interface Repaint {
  name: string;
  apply: (editor: HtmlEditor) => void;
}

const TABLE_MARKUP = '<table><tbody><tr><td>cell</td></tr></tbody></table>';
const COMMAND_TEXT = 'Insert Row Above';

const EMPTY_RECT: DOMRect = {
  x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => ({}),
};

const editors: HtmlEditor[] = [];

const createEditor = (options: Properties): HtmlEditor => {
  const $element = $('<div>').appendTo(document.body);
  const editor: HtmlEditor = new HtmlEditor($element, { value: TABLE_MARKUP, ...options });

  editors.push(editor);

  return editor;
};

const getRowCount = (editor: HtmlEditor): number => editor.$element().find('tr').length;

const clickMenuItem = (editor: HtmlEditor, text: string): void => {
  const menuElement = editor.$element().children('.dx-has-context-menu').get(0);
  const menu = ContextMenu.getInstance<ContextMenu>(menuElement);
  const item = menu.itemsContainer()
    .find('.dx-menu-item')
    .toArray()
    .find((element) => $(element).children('.dx-menu-item-content').text() === text);

  eventsEngine.trigger(item, 'dxclick');
  jest.runAllTimers();
};

const runCommand = (editor: HtmlEditor, commandPath: string[]): void => {
  editor.getQuillInstance().setSelection(0, 0);
  eventsEngine.trigger(editor.$element().find('td'), 'dxcontextmenu');
  jest.runAllTimers();

  commandPath.forEach((text) => { clickMenuItem(editor, text); });
};

const GROUP_OF_NAMES: MenuShape = {
  name: 'a group of predefined names',
  createItems: () => [{ text: 'Rows', items: ['insertRowAbove'] }],
  commandPath: ['Rows', COMMAND_TEXT],
};

const MENU_SHAPES: MenuShape[] = [
  {
    name: 'predefined names',
    createItems: () => ['insertRowAbove'],
    commandPath: [COMMAND_TEXT],
  },
  {
    name: 'objects with a predefined name',
    createItems: () => [{ name: 'insertRowAbove' }],
    commandPath: [COMMAND_TEXT],
  },
  GROUP_OF_NAMES,
  {
    name: 'a group of objects with a predefined name',
    createItems: () => [{ text: 'Rows', items: [{ name: 'insertRowAbove' }] }],
    commandPath: ['Rows', COMMAND_TEXT],
  },
  {
    name: 'a group inside a group',
    createItems: () => [{ text: 'Table', items: [{ text: 'Rows', items: ['insertRowAbove'] }] }],
    commandPath: ['Table', 'Rows', COMMAND_TEXT],
  },
];

const RUNTIME_CHANGES: RuntimeChange[] = [
  {
    name: 'nothing changes at run time',
    createEditor: (items) => createEditor({ tableContextMenu: { enabled: true, items } }),
  },
  {
    name: 'enabled is switched off and on',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: true, items } });

      editor.option('tableContextMenu.enabled', false);
      editor.option('tableContextMenu.enabled', true);

      return editor;
    },
  },
  {
    name: 'enabled is switched on after creation',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: false, items } });

      editor.option('tableContextMenu.enabled', true);

      return editor;
    },
  },
  {
    name: 'enabled is switched on in one update with another option',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: false, items } });

      editor.beginUpdate();
      editor.option('tableContextMenu.enabled', true);
      editor.option('placeholder', 'text');
      editor.endUpdate();

      return editor;
    },
  },
  {
    name: 'items are set',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: true } });

      editor.option('tableContextMenu.items', items);

      return editor;
    },
  },
  {
    name: 'items are replaced',
    createEditor: (items, createOtherItems): HtmlEditor => {
      const editor = createEditor({
        tableContextMenu: { enabled: true, items: createOtherItems() },
      });

      editor.option('tableContextMenu.items', items);

      return editor;
    },
  },
  {
    name: 'items are set while the menu is off',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: false } });

      editor.option('tableContextMenu.items', items);
      editor.option('tableContextMenu.enabled', true);

      return editor;
    },
  },
  {
    name: 'the whole option is set',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: true } });

      editor.option('tableContextMenu', { enabled: true, items });

      return editor;
    },
  },
  {
    name: 'the whole option is set with items before enabled',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: false } });

      editor.option('tableContextMenu', { items, enabled: true });

      return editor;
    },
  },
  {
    name: 'the whole option is set for the first time',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({});

      editor.option('tableContextMenu', { enabled: true, items });

      return editor;
    },
  },
  {
    name: 'the option is reset to null and set again',
    createEditor: (items): HtmlEditor => {
      const editor = createEditor({ tableContextMenu: { enabled: true, items } });

      editor.option('tableContextMenu', null);
      editor.option('tableContextMenu', { enabled: true, items });

      return editor;
    },
  },
];

const REPAINTS: Repaint[] = [
  { name: 'without repaint()', apply: (): void => {} },
  { name: 'after repaint()', apply: (editor): void => { editor.repaint(); } },
  {
    name: 'after two repaint() calls',
    apply: (editor): void => {
      editor.repaint();
      editor.repaint();
    },
  },
];

const OPTIONS_THAT_RECREATE_QUILL: { name: string; options: Properties }[] = [
  { name: 'placeholder', options: { placeholder: 'other text' } },
  { name: 'toolbar', options: { toolbar: { items: ['bold'] } } },
  { name: 'mentions', options: { mentions: [{ dataSource: ['John'] }] } },
  { name: 'variables', options: { variables: { dataSource: ['FirstName'] } } },
  { name: 'allowSoftLineBreak', options: { allowSoftLineBreak: true } },
  { name: 'customizeModules', options: { customizeModules: jest.fn() } },
];

describe('HtmlEditor table context menu with custom items', () => {
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

  describe.each(MENU_SHAPES)('items are $name', ({ createItems, commandPath }) => {
    describe.each(RUNTIME_CHANGES)('$name', ({ createEditor: createChangedEditor }) => {
      it.each(REPAINTS)('runs the command and keeps the passed items $name', ({ apply }) => {
        const items = createItems();
        const editor = createChangedEditor(items, createItems);

        apply(editor);
        runCommand(editor, commandPath);

        expect(getRowCount(editor)).toBe(2);
        expect(items).toEqual(createItems());
      });
    });
  });

  describe.each(OPTIONS_THAT_RECREATE_QUILL)('the $name option changes', ({ options }) => {
    it.each(RUNTIME_CHANGES)('runs the submenu command when $name', ({ createEditor: createChangedEditor }) => {
      const { createItems, commandPath } = GROUP_OF_NAMES;
      const editor = createChangedEditor(createItems(), createItems);

      editor.option(options);
      runCommand(editor, commandPath);

      expect(getRowCount(editor)).toBe(2);
    });
  });

  describe.each(RUNTIME_CHANGES)('two editors share the items, $name in the first editor', ({ createEditor: createChangedEditor }) => {
    const { createItems, commandPath } = GROUP_OF_NAMES;

    it('runs the command of each editor in that editor when the second one is created later', () => {
      const items = createItems();
      const firstEditor = createChangedEditor(items, createItems);
      const secondEditor = createEditor({ tableContextMenu: { enabled: true, items } });

      runCommand(secondEditor, commandPath);

      expect(getRowCount(firstEditor)).toBe(1);
      expect(getRowCount(secondEditor)).toBe(2);

      runCommand(firstEditor, commandPath);

      expect(getRowCount(firstEditor)).toBe(2);
      expect(getRowCount(secondEditor)).toBe(2);
    });

    it('runs the command of each editor in that editor when the second one is repainted later', () => {
      const items = createItems();
      const secondEditor = createEditor({ tableContextMenu: { enabled: true, items } });
      const firstEditor = createChangedEditor(items, createItems);

      secondEditor.repaint();
      runCommand(secondEditor, commandPath);

      expect(getRowCount(firstEditor)).toBe(1);
      expect(getRowCount(secondEditor)).toBe(2);

      runCommand(firstEditor, commandPath);

      expect(getRowCount(firstEditor)).toBe(2);
      expect(getRowCount(secondEditor)).toBe(2);
    });
  });

  it('calls the click handler of a custom item in a group after a run-time change and repaint()', () => {
    const action = { text: 'Action', onClick: jest.fn() };
    const editor = createEditor({
      tableContextMenu: { enabled: true, items: [{ text: 'Custom', items: [action] }] },
    });

    editor.option('tableContextMenu.enabled', false);
    editor.option('tableContextMenu.enabled', true);
    editor.repaint();
    runCommand(editor, ['Custom', 'Action']);

    expect(action.onClick).toHaveBeenCalledTimes(1);
  });

  it('runs a command of the default menu after a run-time change and repaint()', () => {
    const editor = createEditor({ tableContextMenu: { enabled: true } });

    editor.option('tableContextMenu.enabled', false);
    editor.option('tableContextMenu.enabled', true);
    editor.repaint();
    runCommand(editor, ['Insert', COMMAND_TEXT]);

    expect(getRowCount(editor)).toBe(2);
  });
});
