/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

const SELECTORS = {
  cardView: '.dx-cardview',
  rootContainer: '.dx-cardview-root-container',
  statusContainer: '[role="status"]',
  headerPanelContent: '.dx-cardview-headerpanel-content',
  headerItem: '.dx-cardview-header-item',
  card: '.dx-cardview-card',
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

describe('Accessibility attributes', () => {
  afterEach(() => {
    const cardView = rootQuerySelector(SELECTORS.cardView);
    // @ts-expect-error bad typed renderer
    $(cardView ?? undefined as any)?.dxCardView('dispose');
  });

  describe('Root descriprion', () => {
    it('should be displayed on the root container', () => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
      });

      const rootContainer = rootQuerySelector(SELECTORS.rootContainer);
      expect(rootContainer?.getAttribute('role')).toBe('group');
      expect(rootContainer?.getAttribute('aria-label')).toBe('Card view with 5 cards and 1 fields');

      cardView.option('filterValue', ['A', '=', 'A_1']);
      expect(rootContainer?.getAttribute('aria-label')).toBe('Card view with 1 cards and 1 fields');
    });
  });

  describe('Status description', () => {
    it('should be displayed on the status container', () => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
      });

      const statusContainer = rootQuerySelector(SELECTORS.statusContainer);
      expect(statusContainer).not.toBeNull();
      expect(statusContainer?.innerHTML).toBe('');

      cardView.option('filterValue', ['A', '=', 'A_1']);
      expect(statusContainer?.innerHTML).toBe('Card view with 1 cards and 1 fields');

      cardView.option('filterValue', null);
      expect(statusContainer?.innerHTML).toBe('Card view with 5 cards and 1 fields');

      cardView.option('paging', { pageSize: 2 });
      expect(statusContainer?.innerHTML).toBe('Card view with 5 cards and 1 fields');
      cardView.option('paging', { pageIndex: 2 });
      expect(statusContainer?.innerHTML).toBe('Card view with 5 cards and 1 fields');
    });
  });

  describe('Header panel', () => {
    it('should be represented as menubar', () => {
      setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
      });

      const headerPanelContent = rootQuerySelector(SELECTORS.headerPanelContent);
      expect(headerPanelContent?.getAttribute('role')).toBe('menubar');
    });

    it('should contain header panel item with their state', () => {
      setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          sortOrder: 'desc',
          sortIndex: 0,
        }],
      });

      const headerItem = rootQuerySelector(SELECTORS.headerItem);
      expect(headerItem?.getAttribute('aria-label')).toBe('Field name A, Sorted in descending order, Sort index 1');
    });
  });

  describe('Card description', () => {
    it('should take into account its position and status', () => {
      const cardView = setup({
        dataSource: [
          { A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }, { A: 'A_3' }, { A: 'A_4' },
        ],
        columns: ['A'],
        editing: {
          allowUpdating: true,
        },
        selection: {
          mode: 'multiple',
        },
      });

      const firstCard = rootQuerySelector(SELECTORS.card);
      expect(firstCard?.getAttribute('role')).toBe('application');
      expect(firstCard?.getAttribute('aria-roledescription')).toBe('Editable card');
      expect(firstCard?.getAttribute('aria-label')).toBe('Row 1, column 1, Not selected');

      cardView.option('selection', { mode: 'none' });
      expect(firstCard?.getAttribute('aria-label')).toBe('Row 1, column 1');

      cardView.option('editing', { allowUpdating: false });
      expect(firstCard?.getAttribute('aria-roledescription')).toBe('Card');
    });
  });
});
