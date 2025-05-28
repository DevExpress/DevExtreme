/* eslint-disable spellcheck/spell-checker */
import {
  describe,
  expect,
  it,
} from '@jest/globals';
import CardView from '@ts/grids/new/card_view/widget';
import { rerender } from 'inferno';

import { HeaderFilterViewController } from './view_controller';

const SELECTORS = {
  popupContent: '.dx-popup-wrapper.dx-header-filter-menu',
};

const rootQuerySelector = (selector: string) => document.body.querySelector(selector);

describe('HeaderFilter', () => {
  describe('View integration', () => {
    it('should render popup with list by default', () => {
      const container = document.createElement('div');
      const popupContainer = document.createElement('div');
      const { body } = document;
      body.append(container);

      const cardView = new CardView(container, {
        dataSource: [
          { A: 'A_0' },
          { A: 'A_1' },
          { A: 'A_2' },
          { A: 'A_3' },
          { A: 'A_4' },
        ],
        columns: ['A'],
        headerFilter: {
          visible: true,
        },
      });

      // @ts-expect-error getting protected field
      const viewController = cardView.diContext.get(HeaderFilterViewController);

      const column = cardView.getVisibleColumns()[0];
      viewController.openPopup(popupContainer, column);
      rerender();

      expect(rootQuerySelector(SELECTORS.popupContent)).toMatchSnapshot();
    });

    it('should render popup with tree list if dataType is date-like', () => {
      const container = document.createElement('div');
      const popupContainer = document.createElement('div');
      const { body } = document;
      body.append(container);

      const cardView = new CardView(container, {
        dataSource: [
          { A: 'A_0' },
          { A: 'A_1' },
          { A: 'A_2' },
          { A: 'A_3' },
          { A: 'A_4' },
        ],
        columns: [{
          dataField: 'A',
          dataType: 'date',
        }],
        headerFilter: {
          visible: true,
        },
      });

      // @ts-expect-error getting protected field
      const viewController = cardView.diContext.get(HeaderFilterViewController);

      const column = cardView.getVisibleColumns()[0];
      viewController.openPopup(popupContainer, column);
      rerender();

      expect(rootQuerySelector(SELECTORS.popupContent)).toMatchSnapshot();
    });
  });
});
