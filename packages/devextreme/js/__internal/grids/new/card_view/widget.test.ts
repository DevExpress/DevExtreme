/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from '@jest/globals';
import $ from '@js/core/renderer';

import { CardView } from './widget';

describe('common', () => {
  describe('initial render', () => {
    it('should be successfull', () => {
      const container = document.createElement('div');
      const cardView = new CardView(container, {});

      expect(container).toMatchSnapshot();
    });
  });
});

describe('options', () => {
  describe('rtlEnabled', () => {
    const container = document.createElement('div');
    const cardView = new CardView(container, {
      rtlEnabled: true,
      pager: {
        visible: true,
      },
    });

    it('should add dx-rtl class to container div', () => {
      expect(container.classList).toContain('dx-rtl');
    });

    it('should pass rtlEnabled options to nested components', () => {
      expect(
        $(container).find('.dx-pagination')
          // @ts-expect-error
          .dxPagination('instance').option('rtlEnabled'),
      ).toBe(true);
    });
  });
});

describe('regressions', () => {
  it('should not have leaks to defaultOptions after changing option', () => {
    const container = document.createElement('div');
    let cardView = new CardView(container, {
      keyExpr: 'a',
      dataSource: [{ a: 'a' }],
    });

    expect(cardView.option('pager.showPageSizeSelector')).toBe(false);

    cardView.option('pager.showPageSizeSelector', true);
    expect(cardView.option('pager.showPageSizeSelector')).toBe(true);

    cardView.dispose();

    cardView = new CardView(container, {
      keyExpr: 'a',
      dataSource: [{ a: 'a' }],
    });
    expect(cardView.option('pager.showPageSizeSelector')).toBe(false);
  });
});
