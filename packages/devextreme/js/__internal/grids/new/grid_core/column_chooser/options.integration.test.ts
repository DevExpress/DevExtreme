/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { PositionConfig } from '@js/common/core/animation';
import type { ColumnChooserMode } from '@js/common/grids';
import $ from '@js/core/renderer';
import type dxPopup from '@js/ui/popup';
import type dxTreeView from '@js/ui/tree_view';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

import { defaultOptions as columnChooserDefaultOptions } from './options';

const SELECTORS = {
  cardView: '.dx-cardview',
  columnChooserBtn: '.dx-cardview-column-chooser-button',
  popup: '.dx-popup',
  treeView: '.dx-treeview',
};

const defaultOptions = columnChooserDefaultOptions.columnChooser;

const rootQuerySelector = (selector: string) => document.body.querySelector(selector);

const setup = (options: GridCoreOptions = {}): CardView => {
  const container = document.createElement('div');
  const { body } = document;
  body.append(container);

  const cardView = new CardView(container, options);

  rerender();

  return cardView;
};

const setupOpened = (options: GridCoreOptions = {}) => {
  const cardView = setup(options);

  cardView.showColumnChooser();

  rerender();

  return cardView;
};

const getPopupInstance = (): dxPopup => {
  rerender();
  const popupElement = rootQuerySelector(SELECTORS.popup);
  const instance = ($(popupElement ?? undefined) as any).dxPopup('instance') as dxPopup;

  return instance;
};

const getTreeViewInstance = (): dxTreeView => {
  const treeViewElement = rootQuerySelector(SELECTORS.treeView);
  const instance = ($(treeViewElement ?? undefined) as any).dxTreeView('instance') as dxTreeView;

  return instance;
};

describe('Options', () => {
  afterEach(() => {
    const cardView = rootQuerySelector(SELECTORS.cardView);
    // @ts-expect-error bad typed renderer
    $(cardView ?? undefined as any)?.dxCardView('dispose');
  });

  describe('ColumnChooser', () => {
    it.each([
      { value: true, result: true },
      { value: false, result: false },
      { value: undefined, result: defaultOptions!.enabled! },
    ])('enabled: %s', ({ value, result }) => {
      setup({ columnChooser: { enabled: value } });

      const button = rootQuerySelector(SELECTORS.columnChooserBtn);

      expect(!!button).toBe(result);
    });

    it.each<{
      value?: number; result: number | string;
    }>([
      { value: undefined, result: defaultOptions!.width! },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('width: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, width: value },
      });

      const popup = getPopupInstance();

      expect(popup.option('width')).toBe(result);
    });

    it.each<{
      value?: number; result: number | string;
    }>([
      { value: undefined, result: defaultOptions!.height! },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('height: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, height: value },
      });

      const popup = getPopupInstance();

      expect(popup.option('height')).toBe(result);
    });

    it.each<{
      value?: string; result: string | Element | undefined;
    }>([
      { value: undefined, result: defaultOptions!.container },
      { value: '#custom', result: '#custom' },
    ])('container: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, container: value },
      });

      const popup = getPopupInstance();

      expect(popup.option('container')).toBe(result);
    });

    it.each<{
      value?: PositionConfig; result: PositionConfig;
    }>([
      {
        value: undefined,
        result: {
          my: 'right top',
          at: 'right bottom',
          of: '.dx-cardview-column-chooser-button',
          collision: 'fit',
          offset: '-2 -2',
          boundaryOffset: '2 2',
        },
      },
      {
        value: {
          my: 'right top',
          at: 'right bottom',
          of: '.dx-cardview-column-chooser-button',
        },
        result: {
          my: 'right top',
          at: 'right bottom',
          of: '.dx-cardview-column-chooser-button',
        },
      },
    ])('position: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, position: value },
      });

      const popup = getPopupInstance();

      expect(popup.option('position')).toMatchObject(result);
    });

    it.each<{
      value?: string; result: string;
    }>([
      { value: undefined, result: defaultOptions!.emptyPanelText! },
      { value: 'custom value', result: 'custom value' },
    ])('emptyPanelText: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, emptyPanelText: value },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.option('noDataText')).toEqual(result);
    });

    it.each<{
      value?: string; result: string;
    }>([
      { value: undefined, result: defaultOptions!.title! },
      { value: 'custom value', result: 'custom value' },
    ])('title: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, title: value },
      });

      const popup = getPopupInstance();

      expect(popup.option('toolbarItems[0].text')).toBe(result);
    });

    it.each<{
      value?: boolean; result: boolean;
    }>([
      { value: undefined, result: defaultOptions!.search!.enabled! },
      { value: true, result: true },
      { value: false, result: false },
    ])('search.enabled: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, search: { enabled: value } },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.option('searchEnabled')).toBe(result);
    });

    it.each<{
      value?: number; result: number;
    }>([
      { value: undefined, result: defaultOptions!.search!.timeout! },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('search.timeout: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, search: { enabled: true, timeout: value } },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.option('searchTimeout')).toBe(result);
    });

    it.each<{
      value?: Record<string, any>; result: Record<string, any>;
    }>([
      { result: {} },
      { value: { disabled: true }, result: { disabled: true } },
      { value: { height: 999 }, result: { height: 999 } },
    ])('search.editorOptions: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, search: { enabled: true, editorOptions: value } },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.option('searchEditorOptions')).toMatchObject(result);
    });

    it.each<{
      mode?: ColumnChooserMode;
    }>([
      { mode: undefined },
      { mode: 'select' },
      { mode: 'dragAndDrop' },
    ])('mode: $value', ({ mode }) => {
      setupOpened({
        columnChooser: { enabled: true, mode },
      });

      const treeView = getTreeViewInstance();

      if (mode === 'select') {
        expect(['selectAll', 'normal']).toContain(treeView.option('showCheckBoxesMode'));
      } else {
        expect(['none']).toContain(treeView.option('showCheckBoxesMode'));
      }
    });

    it.each<{
      value?: boolean; result: 'selectAll' | 'normal';
    }>([
      { value: undefined, result: defaultOptions!.selection!.allowSelectAll! ? 'selectAll' : 'normal' },
      { value: true, result: 'selectAll' },
      { value: false, result: 'normal' },
    ])('selection.allowSelectAll: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, mode: 'select', selection: { allowSelectAll: value } },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.option('showCheckBoxesMode')).toBe(result);
    });

    it.each<{
      value?: boolean; result: boolean;
    }>([
      { value: undefined, result: defaultOptions!.selection!.selectByClick! },
      { value: true, result: true },
      { value: false, result: false },
    ])('selection.selectByClick: $value', ({ value, result }) => {
      setupOpened({
        columnChooser: { enabled: true, mode: 'select', selection: { selectByClick: value } },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.option('selectByClick')).toBe(result);
    });

    it.each<{
      value?: 'asc' | 'desc'; result: string[];
    }>([
      { value: undefined, result: ['B Column', 'C Column', 'A Column'] },
      { value: 'asc', result: ['A Column', 'B Column', 'C Column'] },
      { value: 'desc', result: ['C Column', 'B Column', 'A Column'] },
    ])('sortOrder: $value', ({ value, result }) => {
      setupOpened({
        columns: ['B Column', 'C Column', 'A Column'],
        columnChooser: { enabled: true, sortOrder: value, mode: 'select' },
      });

      const treeView = getTreeViewInstance();
      const items = (treeView.option('items') ?? []).map((item) => item.text);

      expect(items).toEqual(result);
    });
  });

  describe('Column options related to ColumnChooser', () => {
    it.each<{
      value?: boolean; result: boolean;
    }>([
      { value: true, result: true },
      { value: false, result: false },
    ])('column.visible: $value', ({ value, result }) => {
      setupOpened({
        columns: [{
          dataField: 'column',
          visible: value,
        }],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.getNodes()[0].selected).toBe(result);
    });

    it.each<{
      value?: string; result: string;
    }>([
      { value: undefined, result: 'Test' },
      { value: 'custom caption', result: 'custom caption' },
    ])('column.caption: $value', ({ value, result }) => {
      setupOpened({
        columns: [{
          dataField: 'Test',
          caption: value,
        }],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.getNodes()[0].text).toBe(result);
    });

    it.each<{
      value: boolean; result: boolean;
    }>([
      { value: false, result: true },
      { value: true, result: false },
    ])('column.allowHiding: $value', ({ value, result }) => {
      setupOpened({
        columns: [{
          dataField: 'test column',
          allowHiding: value,
        }],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.getNodes()[0].disabled).toBe(result);
    });

    it.each<{
      value: boolean; result: number;
    }>([
      { value: false, result: 0 },
      { value: true, result: 1 },
    ])('column.showInColumnChooser: $value', ({ value, result }) => {
      setupOpened({
        columns: [{
          dataField: 'test column',
          showInColumnChooser: value,
        }],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.getNodes()).toHaveLength(result);
    });

    it.each<{
      value?: string; result: string;
    }>([
      { value: undefined, result: 'test' },
      { value: 'custom_name', result: 'custom_name' },
    ])('column.name: $value', ({ value, result }) => {
      setupOpened({
        columns: [{
          dataField: 'test',
          name: value,
        }],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      const treeView = getTreeViewInstance();

      expect(treeView.getNodes()[0].itemData?.columnName).toEqual(result);
    });
  });
});
