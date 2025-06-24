/* eslint-disable
  spellcheck/spell-checker,
  @typescript-eslint/no-non-null-assertion,
  @typescript-eslint/explicit-member-accessibility,
  no-new
*/
import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { signal } from '@ts/core/reactive/index';
import { render, rerender } from 'inferno';

import type { PopupState } from './types';
import {
  HeaderFilterPopupComponent,
  HeaderFilterPopupView,
  type OldHeaderFilterPopupInterface,
} from './view';

const oldHeaderFilterMock = {
  init: jest.fn(),
  showHeaderFilterMenu: jest.fn(),
};

jest.mock('@ts/grids/grid_core/header_filter/m_header_filter_core', () => ({
  HeaderFilterView: class {
    init = oldHeaderFilterMock.init;

    showHeaderFilterMenu = oldHeaderFilterMock.showHeaderFilterMenu;
  },
}));

describe('HeaderFilter', () => {
  describe('HeaderFilterPopupComponent', () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let oldHeaderFilterPopupMock: OldHeaderFilterPopupInterface;

    beforeEach(() => {
      oldHeaderFilterPopupMock = {
        render: jest.fn(),
        dispose: jest.fn(),
      };
    });

    it('should render', () => {
      const container = document.createElement('div');

      render(
        <HeaderFilterPopupComponent oldHeaderFilterPopup={oldHeaderFilterPopupMock} />,
        container,
      );

      expect(container).toMatchSnapshot();
    });

    it('should call legacy render after mount', () => {
      const container = document.createElement('div');

      render(
        <HeaderFilterPopupComponent oldHeaderFilterPopup={oldHeaderFilterPopupMock} />,
        container,
      );

      rerender();

      expect(oldHeaderFilterPopupMock!.render).toHaveBeenCalledTimes(1);
    });

    it('should call legacy render after update', () => {
      const container = document.createElement('div');

      render(
        <HeaderFilterPopupComponent oldHeaderFilterPopup={oldHeaderFilterPopupMock} />,
        container,
      );

      rerender();

      render(
        <HeaderFilterPopupComponent oldHeaderFilterPopup={oldHeaderFilterPopupMock} />,
        container,
      );

      expect(oldHeaderFilterPopupMock!.render).toHaveBeenCalledTimes(2);
    });
  });

  describe('View', () => {
    beforeEach(() => {
      oldHeaderFilterMock.init.mockClear();
      oldHeaderFilterMock.showHeaderFilterMenu.mockClear();
    });

    it('should init old popup module on creation', () => {
      new HeaderFilterPopupView(
        {} as any,
        { popupState: signal<PopupState>(null) } as any,
      );

      expect(oldHeaderFilterMock.init).toHaveBeenCalledTimes(1);
    });

    it('should open popup if popupState changed', () => {
      const expectedElement = { 0: {}, length: 1 } as any;
      const expectedOptions = { optA: 'A', optB: 'B' };
      const popupState = signal<PopupState>(null);

      new HeaderFilterPopupView(
        {} as any,
        { popupState } as any,
      );

      popupState.value = { element: {} as any, options: expectedOptions as any };

      expect(oldHeaderFilterMock.showHeaderFilterMenu)
        .toHaveBeenCalledTimes(1);
      expect(oldHeaderFilterMock.showHeaderFilterMenu)
        .toHaveBeenCalledWith(expectedElement, expectedOptions);
    });

    it('should do nothing if popupState update is empty', () => {
      const popupState = signal<PopupState>(null);

      new HeaderFilterPopupView(
        {} as any,
        { popupState } as any,
      );

      popupState.value = { element: {} as any, options: {} as any };
      popupState.value = null;

      expect(oldHeaderFilterMock.showHeaderFilterMenu)
        .toHaveBeenCalledTimes(1);
    });
  });
});
