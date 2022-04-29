import React from 'react';
import { mount } from 'enzyme';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { VirtualScrolling, VirtualScrollingProps } from '../virtual_scrolling';
import { SetRowsViewScrollPositionAction, SetRowsViewContentRenderAction, SetRowsViewOffsetAction } from '../../views/table_content';
import {
  TopScrollingPositionValue,
  RowHeightValue, ItemHeightsValue,
  ViewportSkipValue,
  ViewportTakeValue,
  ViewportStateValue,
  ViewportPageIndex,
  ViewportLoadPageCount,
} from '../plugins';
import {
  VisibleRows, TotalCount,
} from '../../plugins';
import { Plugins } from '../../../../../utils/plugin/context';
import { VirtualContent } from '../virtual_content';
import {
  SetPageIndex, PageSize, SetLoadPageCount, PageIndex,
} from '../../paging/plugins';
import { setWindow } from '../../../../../../core/utils/window';
import { DEFAULT_ROW_HEIGHT } from '../utils';

describe('Virtual scrolling', () => {
  describe('View', () => {
    it('should render value setters', () => {
      const viewProps = {
        scrollPosition: { top: 0, left: 0 },
        onRowsScrollPositionChange: () => {},
        onRowsViewContentRender: () => {},
        rowHeight: 0,
        itemHeights: {},
      } as Partial<VirtualScrolling>;

      const tree = mount(<VirtualScrolling {...viewProps as any} />);
      const setters = tree.children(ValueSetter);

      expect(setters).toHaveLength(6);
      expect(setters.at(0).props().type).toBe(SetRowsViewScrollPositionAction);
      expect(setters.at(1).props().type).toBe(SetRowsViewContentRenderAction);
      expect(setters.at(2).props().type).toBe(TopScrollingPositionValue);
      expect(setters.at(3).props().type).toBe(RowHeightValue);
      expect(setters.at(4).props().type).toBe(ItemHeightsValue);
      expect(setters.at(5).props().type).toBe(ViewportStateValue);
    });

    it('should render getter exrtenders', () => {
      const viewProps = {
        scrollPosition: { top: 0, left: 0 },
        onRowsScrollPositionChange: () => {},
        onRowsViewContentRender: () => {},
        rowHeight: 0,
        itemHeights: {},
      } as Partial<VirtualScrolling>;

      const tree = mount(<VirtualScrolling {...viewProps as any} />);
      const getters = tree.children(GetterExtender);

      expect(getters).toHaveLength(6);
      expect(getters.at(0).props().type).toBe(ViewportSkipValue);
      expect(getters.at(1).props().type).toBe(ViewportTakeValue);
      expect(getters.at(2).props().type).toBe(VisibleRows);
      expect(getters.at(3).props().type).toBe(VisibleRows);
      expect(getters.at(4).props().type).toBe(ViewportPageIndex);
      expect(getters.at(5).props().type).toBe(ViewportLoadPageCount);
    });

    it('should render virtual content', () => {
      const viewProps = {
        scrollPosition: { top: 0, left: 0 },
        onRowsScrollPositionChange: () => {},
        onRowsViewContentRender: () => {},
        rowHeight: 0,
        itemHeights: {},
      } as Partial<VirtualScrolling>;

      const tree = mount(<VirtualScrolling {...viewProps as any} />);
      const virtualContent = tree.children(VirtualContent);

      expect(virtualContent).toHaveLength(1);
    });
  });

  describe('Effects', () => {
    describe('watchViewportPageIndex', () => {
      it('should call SetPageIndex', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        const setPageIndexMock = jest.fn();
        virtualScrolling.plugins.set(SetPageIndex, setPageIndexMock);
        virtualScrolling.plugins.extend(ViewportPageIndex, -1, () => 5);

        virtualScrolling.watchViewportPageIndex();
        expect(setPageIndexMock).toBeCalledWith(5);
      });
    });

    describe('watchViewportLoadPageCount', () => {
      it('should call SetLoadPageCount', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        const setLoadPageCountMock = jest.fn();
        virtualScrolling.plugins.set(SetLoadPageCount, setLoadPageCountMock);
        virtualScrolling.plugins.extend(ViewportLoadPageCount, -1, () => 10);

        virtualScrolling.watchViewportLoadPageCount();
        expect(setLoadPageCountMock).toBeCalledWith(10);
      });
    });

    describe('watchPageIndex', () => {
      it('should call updateViewportState', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.updateViewportState = jest.fn();

        virtualScrolling.watchPageIndex();
        expect(virtualScrolling.updateViewportState).not.toBeCalled();

        virtualScrolling.plugins.set(PageIndex, 10);
        expect(virtualScrolling.updateViewportState).toBeCalledWith({
          type: 'paging',
          value: 10,
        });
      });
    });
  });

  describe('Methods', () => {
    describe('onRowsScrollPositionChange', () => {
      it('should call updateViewportState', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.updateViewportState = jest.fn();

        virtualScrolling.onRowsScrollPositionChange({
          top: 10,
          left: 0,
        });

        expect(virtualScrolling.updateViewportState).toBeCalledWith({
          type: 'scrolling',
          value: 10,
        });
      });
    });

    describe('onRowsViewContentRender', () => {
      it('updateVisibleItemHeights should be called', () => {
        setWindow({ getComputedStyle: () => ({ height: '30px' }) }, true);
        const element = {
          querySelectorAll: () => [{} as any, {} as any, {} as any],
        };
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.updateVisibleItemHeights = jest.fn();

        virtualScrolling.onRowsViewContentRender(element as any);

        expect(virtualScrolling.updateVisibleItemHeights).toBeCalledWith([30, 30, 30]);
      });

      it('updateRowHeight should be celled', () => {
        setWindow({ getComputedStyle: () => ({ height: '30px' }) }, true);
        const element = {
          querySelectorAll: () => [{} as any, {} as any, {} as any],
        };
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.updateRowHeight = jest.fn();

        virtualScrolling.onRowsViewContentRender(element as any);

        expect(virtualScrolling.updateRowHeight).toBeCalledWith([30, 30, 30]);
      });
    });

    describe('updateVisibleItemHeights', () => {
      it.each([
        [
          [{ loadIndex: 0 }, { loadIndex: 1 }, { loadIndex: 2 }],
          undefined,
          [30, 30, 30],
          { 0: 30, 1: 30, 2: 30 },
        ],
        [
          [{ loadIndex: 1 }, { loadIndex: 2 }],
          1,
          [30, 30, 30],
          { 1: 30, 2: 30 },
        ],
        [
          undefined,
          1,
          [30, 30, 30],
          {},
        ],
      ])('visibleItemHeights should be updated', (visibleRows, skip, rowHeights, result) => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins.extend(VisibleRows, -1, () => visibleRows as any[]);
        virtualScrolling.plugins.extend(ViewportSkipValue, -1, () => skip);

        expect(virtualScrolling.itemHeights).toEqual({});

        virtualScrolling.updateVisibleItemHeights(rowHeights);

        expect(virtualScrolling.itemHeights).toEqual(result);
      });
    });

    describe('updateRowHeight', () => {
      it('rowHeight should be updated ', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.visibleItemHeights = { 0: 30, 2: 30, 3: 30 };

        expect(virtualScrolling.rowHeight).toEqual(DEFAULT_ROW_HEIGHT);

        virtualScrolling.updateRowHeight([]);

        expect(virtualScrolling.rowHeight).toEqual(30);
      });
    });

    describe('updateViewportState', () => {
      const generateItemHeights = (rowCount, rowHeight) => {
        const result = {};
        for (let i = 0; i < rowCount; i += 1) {
          result[i] = rowHeight;
        }
        return result;
      };

      it('viewportState synchronized to scrolling (action = scrolling, payload == state, payload != current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();

        expect(virtualScrolling.viewportPayload.topScrollPosition).toEqual(0);
        expect(virtualScrolling.topScrollPosition).toEqual(0);

        virtualScrolling.updateViewportState({
          type: 'scrolling',
          value: 750,
        });

        expect(virtualScrolling.viewportPayload.topScrollPosition).toEqual(750);
        expect(virtualScrolling.topScrollPosition).toEqual(0);
        expect(virtualScrolling.viewportState).toEqual('scrolling');
      });

      it('viewportState synchronized to scrolling (action = scrolling, payload != state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();

        virtualScrolling.viewportPayload.topScrollPosition = 750;
        virtualScrolling.updateViewportState({
          type: 'scrolling',
          value: 1000,
        });

        expect(virtualScrolling.viewportPayload.topScrollPosition).toEqual(1000);
        expect(virtualScrolling.topScrollPosition).toEqual(0);
        expect(virtualScrolling.viewportState).toEqual('scrolling');
      });

      it('viewportState is synchronized (action = scrolling, payload == state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();

        virtualScrolling.viewportPayload.topScrollPosition = 750;
        virtualScrolling.topScrollPosition = 750;

        virtualScrolling.updateViewportState({
          type: 'scrolling',
          value: 750,
        });

        expect(virtualScrolling.viewportPayload.topScrollPosition).toEqual(750);
        expect(virtualScrolling.topScrollPosition).toEqual(750);
        expect(virtualScrolling.viewportState).toEqual('synchronized');
      });

      it('viewportState is scrolling (action = scrolling, payload == state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();

        virtualScrolling.viewportState = 'scrolling';
        virtualScrolling.viewportPayload.topScrollPosition = 750;
        virtualScrolling.topScrollPosition = 750;

        virtualScrolling.updateViewportState({
          type: 'scrolling',
          value: 750,
        });

        expect(virtualScrolling.viewportPayload.topScrollPosition).toEqual(750);
        expect(virtualScrolling.topScrollPosition).toEqual(750);
        expect(virtualScrolling.viewportState).toEqual('scrolling');
      });

      it.each([
        ['scrolling', 850],
        ['paging', 5],
      ])('viewportState is scrolling (action = scrolling/paging, payload != state, payload != current)',
        (actionType: any, actionValue) => {
          const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
          virtualScrolling.plugins = new Plugins();
          virtualScrolling.viewportState = 'scrolling';
          virtualScrolling.viewportPayload.topScrollPosition = 750;
          virtualScrolling.topScrollPosition = 100;

          virtualScrolling.updateViewportState({
            type: actionType,
            value: actionValue,
          });

          expect(virtualScrolling.viewportPayload.topScrollPosition).toEqual(750);
          expect(virtualScrolling.topScrollPosition).toEqual(750);
          expect(virtualScrolling.viewportState).toEqual('synchronized');
        });

      it('viewportState synchronized to paging (action = paging, payload == state, payload != current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        const setOffsetActionMock = jest.fn();
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.set(PageIndex, 0);
        virtualScrolling.plugins.set(SetRowsViewOffsetAction, setOffsetActionMock);

        expect(virtualScrolling.viewportPayload.pageIndex).toEqual(0);

        virtualScrolling.updateViewportState({
          type: 'paging',
          value: 1,
        });

        expect(virtualScrolling.viewportPayload.pageIndex).toEqual(1);
        expect(setOffsetActionMock).not.toHaveBeenCalled();
        expect(virtualScrolling.viewportState).toEqual('paging');
      });

      it('viewportState synchronized to paging (action = paging, payload != state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        const setOffsetActionMock = jest.fn();
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.set(PageIndex, 0);
        virtualScrolling.plugins.set(SetRowsViewOffsetAction, setOffsetActionMock);

        virtualScrolling.viewportPayload.pageIndex = 2;
        virtualScrolling.updateViewportState({
          type: 'paging',
          value: 3,
        });

        expect(virtualScrolling.viewportPayload.pageIndex).toEqual(3);
        expect(setOffsetActionMock).not.toHaveBeenCalled();
        expect(virtualScrolling.viewportState).toEqual('paging');
      });

      it('viewportState is synchronized (action = paging, payload == state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        const setOffsetActionMock = jest.fn();
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.set(PageIndex, 1);
        virtualScrolling.plugins.set(SetRowsViewOffsetAction, setOffsetActionMock);
        virtualScrolling.viewportPayload.pageIndex = 1;

        virtualScrolling.updateViewportState({
          type: 'paging',
          value: 1,
        });

        expect(virtualScrolling.viewportPayload.pageIndex).toEqual(1);
        expect(setOffsetActionMock).not.toHaveBeenCalled();
        expect(virtualScrolling.viewportState).toEqual('synchronized');
      });

      it('viewportState paging to synchronized (action = paging, payload == state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        const setOffsetActionMock = jest.fn();
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.viewportState = 'paging';
        virtualScrolling.plugins.set(PageSize, 5);
        virtualScrolling.plugins.set(PageIndex, 1);
        virtualScrolling.plugins.set(SetRowsViewOffsetAction, setOffsetActionMock);
        virtualScrolling.viewportPayload.pageIndex = 1;

        virtualScrolling.updateViewportState({
          type: 'paging',
          value: 1,
        });

        expect(virtualScrolling.viewportPayload.pageIndex).toEqual(1);
        expect(setOffsetActionMock).toBeCalledWith({
          top: 100,
        });
        expect(virtualScrolling.viewportState).toEqual('synchronized');
      });

      it('viewportState paging to synchronized without scroll (action = paging, payload == state, payload == current)', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        const setOffsetActionMock = jest.fn();
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.viewportState = 'paging';
        virtualScrolling.plugins.set(PageSize, 5);
        virtualScrolling.plugins.set(PageIndex, 0);
        virtualScrolling.plugins.set(SetRowsViewOffsetAction, setOffsetActionMock);
        virtualScrolling.viewportPayload.pageIndex = 0;

        virtualScrolling.updateViewportState({
          type: 'paging',
          value: 0,
        });

        expect(virtualScrolling.viewportPayload.pageIndex).toEqual(0);
        expect(setOffsetActionMock).not.toHaveBeenCalled();
        expect(virtualScrolling.viewportState).toEqual('synchronized');
      });

      describe.each([
        ['paging', 4],
        ['scrolling', 1000],
      ])('when action = %s', (actionType, actionValue) => {
        it.each([
          [20, { top: 1800 }],
          ['all', undefined],
          [undefined, undefined],
        ])('viewportState is paging (action = paging, payload != state, payload != current)', (pageSize, offset) => {
          const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
          const setOffsetActionMock = jest.fn();
          virtualScrolling.plugins = new Plugins();
          virtualScrolling.plugins.set(PageIndex, 2);
          virtualScrolling.plugins.set(PageSize, pageSize);
          virtualScrolling.plugins.set(TotalCount, 100);
          virtualScrolling.plugins.set(SetRowsViewOffsetAction, setOffsetActionMock);
          virtualScrolling.rowHeight = 30;
          virtualScrolling.topScrollPosition = 500;
          virtualScrolling.visibleItemHeights = generateItemHeights(10, 30);
          virtualScrolling.viewportState = 'paging';

          virtualScrolling.viewportPayload.pageIndex = 3;

          virtualScrolling.updateViewportState({
            type: actionType as any,
            value: actionValue,
          });

          expect(virtualScrolling.viewportPayload.pageIndex).toEqual(3);
          if (!offset) {
            expect(setOffsetActionMock).not.toHaveBeenCalled();
          } else {
            expect(setOffsetActionMock).toBeCalledWith(offset);
          }
          expect(virtualScrolling.viewportState).toEqual('synchronized');
        });
      });
    });
  });
});
