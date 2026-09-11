/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import type * as dxForm from '@js/ui/form';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

const SELECTORS = {
  editButton: '[aria-label="edit"]',
  editorInput: '.dx-texteditor-input',
  labelText: '.dx-field-item-label-text',
};

let cardView: CardView | null = null;

const setup = async (editing: GridCoreOptions['editing'] = {}): Promise<void> => {
  const container = document.createElement('div');
  document.body.append(container);

  cardView = new CardView(container, {
    dataSource: [{ id: 1, name: 'John', city: 'London' }],
    keyExpr: 'id',
    columns: ['name', 'city'],
    editing: { allowUpdating: true, ...editing },
  });

  // @ts-expect-error protected property
  await cardView.dataController.waitLoaded();
  rerender();
};

const startEditing = (): void => {
  document.querySelector(SELECTORS.editButton)
    ?.dispatchEvent(new MouseEvent('click'));
  rerender();
};

const getEditorValues = (): string[] => [
  ...document.querySelectorAll<HTMLInputElement>(SELECTORS.editorInput),
].map((input) => input.value);

describe('edit popup form', () => {
  afterEach(() => {
    cardView?.dispose();
    cardView = null;
    document.body.innerHTML = '';
  });

  it('should fill editors with card data', async () => {
    await setup();

    startEditing();

    expect(getEditorValues()).toEqual(['John', 'London']);
  });

  it('should fill editors with card data when editing.form.customizeItem is set', async () => {
    await setup({ form: { customizeItem: () => {} } });

    startEditing();

    expect(getEditorValues()).toEqual(['John', 'London']);
  });

  it('should call editing.form.customizeItem for every form item', async () => {
    const customizeItem = jest.fn();

    await setup({ form: { customizeItem } });

    startEditing();

    const dataFields = customizeItem.mock.calls
      .map(([item]) => (item as dxForm.SimpleItem).dataField);

    expect(dataFields).toEqual(['name', 'city']);
  });

  it('should let editing.form.customizeItem override the built-in item settings', async () => {
    await setup({
      form: {
        customizeItem: (item) => {
          const simpleItem = item as dxForm.SimpleItem;
          simpleItem.label = { text: `custom ${simpleItem.dataField}` };
        },
      },
    });

    startEditing();

    const labels = [...document.querySelectorAll(SELECTORS.labelText)]
      .map((label) => label.textContent);

    expect(labels).toEqual(['custom name:', 'custom city:']);
  });
});
