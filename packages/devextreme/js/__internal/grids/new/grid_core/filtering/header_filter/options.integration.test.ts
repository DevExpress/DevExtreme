/* eslint-disable spellcheck/spell-checker, no-spaced-func */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Filter } from '@ts/grids/grid_core/data_controller/m_data_controller';
import CardView from '@ts/grids/new/card_view/widget';
import type {
  HeaderFilterSearchColumnOptions,
  HeaderFilterSearchMode,
  HeaderFilterTextOptions, HeaderFilterType,
} from '@ts/grids/new/grid_core/filtering/header_filter/types';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

import { defaultOptions } from './options';
import { HeaderFilterViewController } from './view_controller';

const SELECTORS = {
  cardView: '.dx-cardview',
  headers: '.dx-cardview-headers',
  popup: '.dx-popup',
  popupContent: '.dx-popup-wrapper.dx-header-filter-menu',
  list: '.dx-list',
};

const rootQuerySelector = (selector: string) => document.body.querySelector(selector);

const setup = (options: GridCoreOptions = {}): CardView => {
  const container = document.createElement('div');
  const { body } = document;
  body.append(container);

  const cardView = new CardView(container, options);

  rerender();

  return cardView;
};

const openHeaderFilterPopup = (cardView: CardView): Element => {
  const popupContainer = document.createElement('div');

  // @ts-expect-error get protected property
  const viewController = cardView.diContext.get(HeaderFilterViewController);

  const column = cardView.getVisibleColumns()[0];
  viewController.openPopup(popupContainer, column);
  rerender();

  return popupContainer;
};

const getPopup = () => {
  const popupElement = rootQuerySelector(SELECTORS.popup);
  const realPopupContentElement = rootQuerySelector(SELECTORS.popupContent);
  const instance = ($(popupElement ?? undefined) as any).dxPopup('instance');

  return { element: realPopupContentElement, instance };
};

const getPopupList = (popupContentElement: Element | null) => {
  const listElement = popupContentElement?.querySelector(SELECTORS.list);
  const instance = ($(listElement ?? undefined) as any).dxList('instance');

  return { element: listElement, instance };
};

describe('Options', () => {
  afterEach(() => {
    const cardView = rootQuerySelector(SELECTORS.cardView);
    // @ts-expect-error bad typed renderer
    $(cardView ?? undefined as any)?.dxCardView('dispose');
  });

  describe('HeaderFilter', () => {
    it.each([true, false, undefined])('visible: %s', () => {
      setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true },
      });

      const headerPanel = rootQuerySelector(SELECTORS.headers);

      // NOTE: Check that headerPanel has (or not) filter icon
      expect(headerPanel).toMatchSnapshot();
    });

    it.each<{
      value?: number; result: number | string | undefined;
    }>([
      { value: undefined, result: defaultOptions.headerFilter?.width },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('width: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, width: value },
      });

      openHeaderFilterPopup(cardView);
      const { instance: popupInstance } = getPopup();

      expect(popupInstance.option('width')).toBe(result);
    });

    it.each<{
      value?: number; result: number | string | undefined;
    }>([
      { value: undefined, result: defaultOptions.headerFilter?.height },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('height: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, height: value },
      });

      openHeaderFilterPopup(cardView);
      const { instance: popupInstance } = getPopup();

      expect(popupInstance.option('height')).toBe(result);
    });

    it.each<{
      value?: boolean; result: 'all' | 'multiple';
    }>([
      { value: undefined, result: 'all' },
      { value: true, result: 'all' },
      { value: false, result: 'multiple' },
    ])('allowSelectAll: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, allowSelectAll: value },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('selectionMode')).toBe(result);
    });

    it.each<{
      value?: boolean; result: boolean;
    }>([
      { value: undefined, result: false },
      { value: true, result: true },
      { value: false, result: false },
    ])('search.enabled: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, search: { enabled: value } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchEnabled')).toBe(result);
    });

    it.each<{
      value?: number; result: number;
    }>([
      { value: undefined, result: 500 },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('search.timeout: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, search: { enabled: true, timeout: value } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchTimeout')).toBe(result);
    });

    it.each<{
      value?: HeaderFilterSearchMode; result: HeaderFilterSearchMode;
    }>([
      { value: undefined, result: 'contains' },
      { value: 'contains', result: 'contains' },
      { value: 'equals', result: 'equals' },
      { value: 'startswith', result: 'startswith' },
    ])('search.mode: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, search: { enabled: true, mode: value } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchMode')).toBe(result);
    });

    it.each<{
      value?: Record<string, any>; result: Record<string, any>;
    }>([
      { result: {} },
      { value: { disabled: true }, result: { disabled: true } },
      { value: { height: 999 }, result: { height: 999 } },
    ])('search.editorOptions: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: { visible: true, search: { enabled: true, editorOptions: value } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchEditorOptions')).toMatchObject(result);
    });

    it.each<{
      caseName: string; texts?: HeaderFilterTextOptions;
    }>([
      { caseName: 'default translation' },
      {
        caseName: 'custom translations',
        texts: { ok: 'TEST_OK', cancel: 'TEST_CANCEL', emptyValue: 'TEST_EMTPY' },
      },
    ])('texts: $caseName', ({ texts }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          // NOTE: WA for check "emptyValue" translation
          calculateFieldValue: (): null => null,
        }],
        headerFilter: {
          visible: true,
          texts,
        },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();

      expect(popupContentElement).toMatchSnapshot();
    });

    // NOTE: Skip test because FilterSync feature disabled
    it.skip.each<{
      filterValue: Filter; result: number;
    }>([
      {
        filterValue: ['!', [['A', '=', 'A_0']]], result: 4,
      },
    ])('should render correct list total count if filterValue has negation', ({ filterValue, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
        }],
        filterValue,
        headerFilter: {
          visible: true,
        },
        _filterSyncEnabled: true,
        filterPanel: { visible: true },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);
      const listCount = instance._selection.options.totalCount();

      expect(listCount).toStrictEqual(result);
    });
  });

  describe('Column.HeaderFilter', () => {
    it.each<{
      value?: number; result: number | string | undefined;
    }>([
      { value: undefined, result: -999 },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('width: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            width: value,
          },
        }],
        headerFilter: { visible: true, width: -999 },
      });

      openHeaderFilterPopup(cardView);
      const { instance: popupInstance } = getPopup();

      expect(popupInstance.option('width')).toBe(result);
    });

    it.each<{
      value?: number; result: number | string | undefined;
    }>([
      { value: undefined, result: -999 },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('height: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            height: value,
          },
        }],
        headerFilter: { visible: true, height: -999 },
      });

      openHeaderFilterPopup(cardView);
      const { instance: popupInstance } = getPopup();

      expect(popupInstance.option('height')).toBe(result);
    });

    it.each<{
      value?: boolean; result: 'all' | 'multiple';
    }>([
      { value: undefined, result: 'all' },
      { value: true, result: 'all' },
      { value: false, result: 'multiple' },
    ])('allowSelectAll: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            allowSelectAll: value,
          },
        }],
        headerFilter: { visible: true, allowSelectAll: !value },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('selectionMode')).toBe(result);
    });

    it.each<{
      value?: boolean; result: boolean;
    }>([
      { value: undefined, result: true },
      { value: true, result: true },
      { value: false, result: false },
    ])('search.enabled: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            search: { enabled: value },
          },
        }],
        headerFilter: { visible: true, search: { enabled: true } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchEnabled')).toBe(result);
    });

    it.each<{
      value?: number; result: number;
    }>([
      { value: undefined, result: 1 },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('search.timeout: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            search: {
              timeout: value,
            },
          },
        }],
        headerFilter: { visible: true, search: { enabled: true, timeout: 1 } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchTimeout')).toBe(result);
    });

    it.each<{
      value?: HeaderFilterSearchMode; result: HeaderFilterSearchMode;
    }>([
      { value: undefined, result: 'contains' },
      { value: 'contains', result: 'contains' },
      { value: 'equals', result: 'equals' },
      { value: 'startswith', result: 'startswith' },
    ])('search.mode: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            search: {
              mode: value,
            },
          },
        }],
        headerFilter: { visible: true, search: { enabled: true } },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchMode')).toBe(result);
    });

    it.each<{
      value?: Record<string, any>; result: Record<string, any>;
    }>([
      { result: {} },
      { value: { disabled: true }, result: { disabled: true } },
      { value: { height: 999 }, result: { height: 999 } },
    ])('search.editorOptions: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            search: {
              editorOptions: value,
            },
          },
        }],
        headerFilter: {
          visible: true,
          search:
            { enabled: true, editorOptions: { disabled: false, height: 10 } },
        },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      expect(instance.option('searchEditorOptions')).toMatchObject(result);
    });

    it('search.searchExpr: undefined', () => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            search: {
              searchExpr: undefined,
            },
          },
        }],
        headerFilter: {
          visible: true,
          search: { enabled: true },
        },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      const searchExpr = instance.option('searchExpr');

      expect(typeof searchExpr).toBe('function');
    });

    it.each<{
      value?: HeaderFilterSearchColumnOptions['searchExpr']; result: any;
    }>([
      { value: ['B'], result: ['B'] },
      { value: ['B', 'C', 'D'], result: ['B', 'C', 'D'] },
      { value: [() => {}], result: [() => {}] },
      { value: ['B', () => {}, 'D'], result: ['B', () => {}, 'D'] },
    ])('search.searchExpr: $value', ({ value, result }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: {
            search: {
              searchExpr: value,
            },
          },
        }],
        headerFilter: {
          visible: true,
          search: { enabled: true },
        },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();
      const { instance } = getPopupList(popupContentElement);

      const searchExpr = instance.option('searchExpr');

      searchExpr.forEach((expr, idx) => {
        if (typeof result[idx] === 'function') {
          // NOTE: We cannot test custom selector fn here.
          expect(typeof expr).toBe('function');
        } else {
          expect(expr).toEqual(result[idx]);
        }
      });
    });

    it.each<{
      caseName: string;
      filterType?: HeaderFilterType;
      filterValues?: string[];
    }>([
      { caseName: 'exclude filter', filterType: 'exclude' },
      { caseName: 'filter values', filterValues: ['B'] },
      { caseName: 'exclude filter with values', filterType: 'exclude', filterValues: ['B'] },
    ])('filterType + values: $caseName', ({ filterType, filterValues }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0', B: 'B_0' },
          { A: 'A_1', B: 'B_1' },
          { A: 'A_2', B: 'B_2' },
          { A: 'A_3', B: 'B_3' },
          { A: 'A_4', B: 'B_4' },
        ],
        columns: [{
          dataField: 'A',
          filterValues,
          filterType,
        }],
        headerFilter: {
          visible: true,
        },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();

      expect(popupContentElement).toMatchSnapshot();
    });

    it.each<{
      caseName: string;
      dataSource?: ({ text: string; value: string })[];
      filterType?: HeaderFilterType;
      filterValues?: string[];
    }>([
      {
        caseName: 'custom dataSource',
        dataSource: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }],
        filterType: undefined,
        filterValues: undefined,
      },
      {
        caseName: 'custom dataSource with exclude filter',
        dataSource: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }],
        filterType: 'exclude',
        filterValues: undefined,
      },
      {
        caseName: 'custom dataSource with filter values',
        dataSource: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }],
        filterValues: ['B'],
      },
      {
        caseName: 'custom dataSource with exclude filter and values',
        dataSource: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }],
        filterType: 'exclude',
        filterValues: ['B'],
      },
    ])('dataSource: $caseName', ({ dataSource, filterType, filterValues }) => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0', B: 'B_0' },
          { A: 'A_1', B: 'B_1' },
          { A: 'A_2', B: 'B_2' },
          { A: 'A_3', B: 'B_3' },
          { A: 'A_4', B: 'B_4' },
        ],
        columns: [{
          dataField: 'A',
          headerFilter: { dataSource },
          filterValues,
          filterType,
        }],
        headerFilter: {
          visible: true,
        },
      });

      openHeaderFilterPopup(cardView);
      const { element: popupContentElement } = getPopup();

      expect(popupContentElement).toMatchSnapshot();
    });
  });
});
