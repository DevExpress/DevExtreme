import {
  afterEach, beforeAll, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { componentRegistratorCallbacks } from '@ts/core/component_registrator_callbacks';
import { readdirSync } from 'fs';
import { join, resolve } from 'path';

interface EditorInstance {
  option: (name: string, value?: unknown) => unknown;
  dispose: () => void;
}

type EditorClass = new (element: HTMLElement, options: Record<string, unknown>) => EditorInstance;

interface DirtyScenario {
  options?: Record<string, unknown>;
  createValue: () => unknown;
  changedValue: unknown;
}

const PUBLIC_UI_DIRECTORY = resolve(__dirname, '../../../../ui');
const COMPONENTS_NOT_UPDATING_IS_DIRTY = ['dxDateView'];

const ITEMS = [{ id: 1, text: 'one' }, { id: 2, text: 'two' }];
const LIST_OPTIONS = { items: ITEMS, displayExpr: 'text' };
const ATTACHED_FILE = new File(['content'], 'file.txt');

const copyItem = (index: number): Record<string, unknown> => ({ ...ITEMS[index] });

const textScenario: DirtyScenario = { createValue: () => 'one', changedValue: 'two' };
const numberScenario: DirtyScenario = { createValue: () => 10, changedValue: 20 };
const booleanScenario: DirtyScenario = { createValue: () => true, changedValue: false };
const colorScenario: DirtyScenario = { createValue: () => '#ff0000', changedValue: '#00ff00' };
const dateScenario: DirtyScenario = {
  createValue: () => new Date(2026, 9, 12),
  changedValue: new Date(2026, 9, 13),
};
const objectItemScenario: DirtyScenario = {
  options: LIST_OPTIONS,
  createValue: () => ITEMS[0],
  changedValue: ITEMS[1],
};

const scenarios: Record<string, DirtyScenario> = {
  dxAutocomplete: textScenario,
  dxCalendar: dateScenario,
  dxCheckBox: booleanScenario,
  dxColorBox: colorScenario,
  dxColorView: colorScenario,
  dxDateBox: dateScenario,
  dxDateRangeBox: {
    createValue: () => [new Date(2026, 9, 12), new Date(2026, 9, 13)],
    changedValue: [new Date(2026, 9, 14), new Date(2026, 9, 15)],
  },
  dxDropDownBox: {
    options: { dataSource: ITEMS, displayExpr: 'text' },
    createValue: () => ITEMS[0],
    changedValue: ITEMS[1],
  },
  dxDropDownEditor: { createValue: () => ITEMS[0], changedValue: ITEMS[1] },
  dxDropDownList: objectItemScenario,
  dxFileUploader: { createValue: () => [ATTACHED_FILE], changedValue: [] },
  dxHtmlEditor: { createValue: () => '<p>one</p>', changedValue: '<p>two</p>' },
  dxLookup: objectItemScenario,
  dxNumberBox: numberScenario,
  dxProgressBar: numberScenario,
  dxRadioButton: booleanScenario,
  dxRadioGroup: objectItemScenario,
  dxRangeSlider: { createValue: () => [10, 50], changedValue: [20, 60] },
  dxSelectBox: objectItemScenario,
  dxSlider: numberScenario,
  dxSwitch: booleanScenario,
  dxTagBox: { options: LIST_OPTIONS, createValue: () => [copyItem(0)], changedValue: [ITEMS[1]] },
  dxTextArea: textScenario,
  dxTextBox: textScenario,
  dxTextEditor: textScenario,
  dxTimeView: dateScenario,
  dxTrackBar: numberScenario,
};

const registeredComponents: Record<string, EditorClass> = {};
const editors: EditorInstance[] = [];

const listModuleFiles = (directory: string): string[] => readdirSync(
  directory,
  { withFileTypes: true },
).flatMap((entry) => {
  const entryPath = join(directory, entry.name);

  if (entry.isDirectory()) {
    return listModuleFiles(entryPath);
  }

  return entry.name.endsWith('.js') ? [entryPath] : [];
});

const loadPublicUiModules = (): void => {
  listModuleFiles(PUBLIC_UI_DIRECTORY).forEach((file) => {
    try {
      jest.requireActual(file);
    } catch {
      // a module that cannot be loaded in jsdom registers no component and is not checked
    }
  });

  componentRegistratorCallbacks.add((name: string, componentClass: EditorClass) => {
    registeredComponents[name] = componentClass;
  });
};

const hasDirtyTrackedValue = (componentClass: EditorClass): boolean => {
  const prototype = componentClass.prototype as { _getDefaultOptions: () => object };
  const defaultOptions = Object.create(prototype)._getDefaultOptions() as Record<string, unknown>;

  return 'value' in defaultOptions && defaultOptions.isDirty === false;
};

const createEditor = (name: string, options: Record<string, unknown>): EditorInstance => {
  const $container = $('<div>').appendTo(document.body);
  const element = $('<div>').appendTo($container).get(0) as HTMLElement;
  const instance = new registeredComponents[name](element, options);

  editors.push(instance);

  return instance;
};

describe('Editors isDirty when the value returns to its initial content (T1336605)', () => {
  beforeAll(() => {
    loadPublicUiModules();
  });

  afterEach(() => {
    editors.forEach((instance) => instance.dispose());
    editors.length = 0;
    document.body.innerHTML = '';
  });

  it('should cover every component with value and isDirty options', () => {
    const dirtyTrackedComponents = Object.keys(registeredComponents)
      .filter((name) => hasDirtyTrackedValue(registeredComponents[name]))
      .sort();
    const coveredComponents = [...Object.keys(scenarios), ...COMPONENTS_NOT_UPDATING_IS_DIRTY];

    expect(coveredComponents.sort()).toEqual(dirtyTrackedComponents);
  });

  it.each(COMPONENTS_NOT_UPDATING_IS_DIRTY)('%s should keep isDirty false because it does not pass value changes to Editor', (name) => {
    const instance = createEditor(name, { value: dateScenario.createValue() });

    instance.option('value', dateScenario.changedValue);

    expect(instance.option('value')).toEqual(dateScenario.changedValue);
    expect(instance.option('isDirty')).toBe(false);
  });

  it.each(Object.keys(scenarios))('%s should be dirty after a change and pristine after an equal value returns', (name) => {
    const { options, createValue, changedValue } = scenarios[name];
    const instance = createEditor(name, { ...options, value: createValue() });

    instance.option('value', changedValue);

    expect(instance.option('isDirty')).toBe(true);

    instance.option('value', createValue());

    expect(instance.option('isDirty')).toBe(false);
  });
});
