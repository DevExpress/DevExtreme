/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { PositionConfig } from '@js/common/core/animation';
import $ from '@js/core/renderer';
import type dxPopup from '@js/ui/popup';
import type dxTreeView from '@js/ui/tree_view';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

import { CLASSES as ContentViewClasses } from '../content_view/content_view';
import { defaultOptions } from './options';

const SELECTORS = {
  cardView: '.dx-cardview',
  columnChooserBtn: '.dx-cardview-column-chooser-button',
  popup: '.dx-popup',
  treeView: '.dx-treeview',
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
      { value: undefined, result: false },
    ])('enabled: %s', ({ value, result }) => {
      setup({ columnChooser: { enabled: value } });

      const button = rootQuerySelector(SELECTORS.columnChooserBtn);

      expect(!!button).toBe(result);
    });

    it.each<{
      value?: number; result: number | string | undefined;
    }>([
      { value: undefined, result: defaultOptions.columnChooser?.width },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('width: $value', ({ value, result }) => {
      const cardView = setup({
        columnChooser: { enabled: true, width: value },
      });
      cardView.showColumnChooser();

      const popup = getPopupInstance();

      expect(popup.option('width')).toBe(result);
    });

    it.each<{
      value?: number; result: number | string | undefined;
    }>([
      { value: undefined, result: defaultOptions.columnChooser?.height },
      { value: 100, result: 100 },
      { value: 1000, result: 1000 },
    ])('height: $value', ({ value, result }) => {
      const cardView = setup({
        columnChooser: { enabled: true, height: value },
      });
      cardView.showColumnChooser();

      const popup = getPopupInstance();

      expect(popup.option('height')).toBe(result);
    });

    it.each<{
      value?: string; result?: string;
    }>([
      { value: undefined, result: undefined },
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
          my: 'right bottom',
          at: 'right bottom',
          of: ContentViewClasses.contentView,
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

    // Implement when dragAndDrop mode is developed
    it.skip.each<{
      value?: string; result?: string;
    }>([
      { value: undefined, result: defaultOptions.columnChooser?.emptyPanelText },
      { value: 'custom value', result: 'custom value' },
    ])('emptyPanelText: $value', ({ value }) => {
      setupOpened({
        columnChooser: { enabled: true, emptyPanelText: value },
      });

      // TODO
    });

    it.each<{
      value?: string; result?: string;
    }>([
      { value: undefined, result: defaultOptions.columnChooser?.title },
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
      { value: undefined, result: false },
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
      { value: undefined, result: 500 },
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

    // Implement when dragAndDrop mode is developed
    it.skip.each<{
      value?: 'select' | 'dragAndDrop'; result?: 'select' | 'dragAndDrop';
    }>([
      { value: undefined, result: defaultOptions.columnChooser?.mode },
      { value: 'select', result: 'select' },
      { value: 'dragAndDrop', result: 'dragAndDrop' },
    ])('mode: $value', ({ value }) => {
      setupOpened({
        columnChooser: { enabled: true, mode: value },
      });

      // TODO
    });

    it.each<{
      value?: boolean; result: 'selectAll' | 'normal';
    }>([
      { value: undefined, result: 'normal' },
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
      { value: undefined, result: false },
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
});
