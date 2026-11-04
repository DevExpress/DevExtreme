/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import Sortable from '@js/ui/sortable';
import type { DragMoveEvent, DragStartEvent, ReorderEvent } from '@js/ui/sortable_types';
import type { Options as CardViewOptions } from '@ts/grids/new/card_view/options';
import CardView from '@ts/grids/new/card_view/widget';
import { rerender } from 'inferno';

import { CLASSES as HEADER_PANEL_CLASSES } from './header_panel';
import { CLASSES as ITEM_CLASSES } from './item';

const cardViews: CardView[] = [];

const setup = (options: CardViewOptions): void => {
  const container = document.createElement('div');
  document.body.append(container);

  cardViews.push(new CardView(container, options));

  rerender();
};

const getHeaderPanelSortable = (): Sortable => {
  const element = document.querySelector(`.${HEADER_PANEL_CLASSES.sortable}`);

  if (!element) {
    throw new Error('Header panel sortable not found');
  }

  return Sortable.getInstance(element) as Sortable;
};

const getHeaderCaptions = (): string[] => Array.from(
  document.querySelectorAll(`.${ITEM_CLASSES.item}`),
).map((item) => item.textContent?.trim() ?? '');

const dragHeader = (fromIndex: number, lastMoveToIndex: number, dropToIndex: number): void => {
  const sortable = getHeaderPanelSortable();
  const onDragStart = sortable.option('onDragStart') as (e: DragStartEvent) => void;
  const onDragMove = sortable.option('onDragMove') as (e: DragMoveEvent) => void;
  const onReorder = sortable.option('onReorder') as (e: ReorderEvent) => void;

  const dragStartEvent = { fromIndex } as DragStartEvent;
  onDragStart(dragStartEvent);
  const { itemData } = dragStartEvent;

  onDragMove({
    component: sortable,
    element: sortable.element(),
    toComponent: sortable,
    event: { clientX: 0, clientY: 0 },
    fromIndex,
    toIndex: lastMoveToIndex,
    itemData,
  } as unknown as DragMoveEvent);

  onReorder({
    component: sortable,
    element: sortable.element(),
    toComponent: sortable,
    fromIndex,
    toIndex: dropToIndex,
    itemData,
  } as unknown as ReorderEvent);

  rerender();
};

describe('CardView', () => {
  describe('HeaderPanel column reordering', () => {
    afterEach(() => {
      cardViews.splice(0).forEach((cardView) => cardView.dispose());
      document.body.innerHTML = '';
    });

    it.each([
      {
        name: 'right, the last drag move reported the previous index (T1324855)',
        fromIndex: 0,
        lastMoveToIndex: 0,
        dropToIndex: 1,
        expected: ['B', 'A', 'C'],
      },
      {
        name: 'left, the last drag move reported the previous index (T1324855)',
        fromIndex: 2,
        lastMoveToIndex: 2,
        dropToIndex: 1,
        expected: ['A', 'C', 'B'],
      },
      {
        name: 'right, the last drag move reported the drop index',
        fromIndex: 0,
        lastMoveToIndex: 1,
        dropToIndex: 1,
        expected: ['B', 'A', 'C'],
      },
    ])('moves a column $name', ({
      fromIndex, lastMoveToIndex, dropToIndex, expected,
    }) => {
      setup({
        dataSource: [{ a: 1, b: 2, c: 3 }],
        columns: ['a', 'b', 'c'],
        allowColumnReordering: true,
      });

      expect(getHeaderCaptions()).toEqual(['A', 'B', 'C']);

      dragHeader(fromIndex, lastMoveToIndex, dropToIndex);

      expect(getHeaderCaptions()).toEqual(expected);
    });
  });
});
