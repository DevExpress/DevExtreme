/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { throwError } from '@ts/grids/new/grid_core/options_validation/utils';
import { rerender } from 'inferno';

const SELECTORS = {
  cardView: '.dx-cardview',
  addButton: '[aria-label="add"]',
  editButton: '[aria-label="edit"]',
  deleteButton: '[aria-label="trash"]',
};

const setup = (options: GridCoreOptions = {}): CardView => {
  const container = document.createElement('div');
  const { body } = document;
  body.append(container);

  const cardView = new CardView(container, options);
  rerender();
  return cardView;
};

const getAddButton = (): Element | null => document.querySelector(SELECTORS.addButton);

const getEditButton = (): Element | null => document.querySelector(SELECTORS.editButton);

const getDeleteButton = (): Element | null => document.querySelector(SELECTORS.deleteButton);

const checkError = (): void => expect(throwError).toHaveBeenCalledWith('E1042', 'CardView');

jest.mock('@ts/grids/new/grid_core/options_validation/utils', () => ({
  throwError: jest.fn().mockImplementation(() => ({})),
}));

describe('editing validation', () => {
  afterEach(() => {
    const cardView = document.querySelector(SELECTORS.cardView);
    // @ts-expect-error bad typed renderer
    $(cardView ?? undefined as any)?.dxCardView('dispose');
    document.body.innerHTML = '';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when no keyExpr and clicking on add', () => {
    setup({
      dataSource: [{ value: 'test1' }],
      editing: { allowAdding: true },
    });

    const addButton = getAddButton();
    addButton?.dispatchEvent(new MouseEvent('click'));

    checkError();
  });

  it('should throw error when no keyExpr and clicking on edit', () => {
    setup({
      dataSource: [{ value: 'test1' }],
      editing: { allowUpdating: true },
    });
    const editButton = getEditButton();
    editButton?.dispatchEvent(new MouseEvent('click'));

    checkError();
  });

  it('should throw error when no keyExpr and clicking on delete', () => {
    setup({
      dataSource: [{ value: 'test1' }],
      editing: { allowDeleting: true },
    });
    const deleteButton = getDeleteButton();
    deleteButton?.dispatchEvent(new MouseEvent('click'));

    checkError();
  });
});
