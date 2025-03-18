/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from '@jest/globals';

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
