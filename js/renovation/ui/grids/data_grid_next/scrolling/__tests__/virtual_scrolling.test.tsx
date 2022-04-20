import React from 'react';
import { mount } from 'enzyme';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { VirtualScrolling, VirtualScrollingProps } from '../virtual_scrolling';
import { SetRowsViewScrollPositionAction, SetRowsViewContentRenderAction } from '../../views/table_content';
import {
  ScrollingPositionValue,
  RowHeightValue, ItemHeightsValue,
  ViewportSkipValue,
  ViewportTakeValue,
} from '../plugins';
import {
  VisibleRows, TotalCount,
} from '../../plugins';
import { Plugins } from '../../../../../utils/plugin/context';
import { VirtualContent } from '../virtual_content';
import {
  SetPageIndex, PageSize, SetLoadPageCount,
} from '../../paging/plugins';
import { setWindow } from '../../../../../../core/utils/window';

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

      expect(setters).toHaveLength(5);
      expect(setters.at(0).props().type).toBe(SetRowsViewScrollPositionAction);
      expect(setters.at(1).props().type).toBe(SetRowsViewContentRenderAction);
      expect(setters.at(2).props().type).toBe(ScrollingPositionValue);
      expect(setters.at(3).props().type).toBe(RowHeightValue);
      expect(setters.at(4).props().type).toBe(ItemHeightsValue);
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

      expect(getters).toHaveLength(4);
      expect(getters.at(0).props().type).toBe(ViewportSkipValue);
      expect(getters.at(1).props().type).toBe(ViewportTakeValue);
      expect(getters.at(2).props().type).toBe(VisibleRows);
      expect(getters.at(3).props().type).toBe(VisibleRows);
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
    describe('watchTotalCount', () => {
      it('should call loadViewport', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.loadViewport = jest.fn();

        virtualScrolling.watchTotalCount();
        expect(virtualScrolling.loadViewport).not.toHaveBeenCalled();

        virtualScrolling.plugins.set(TotalCount, 5);

        expect(virtualScrolling.loadViewport).toHaveBeenCalled();
      });
    });

    describe('watchViewportSkipValue', () => {
      it('should update viewportSkipValue', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.extend(ViewportSkipValue, -1, () => 5);

        expect(virtualScrolling.viewportSkipValue).toEqual(0);

        virtualScrolling.watchViewportSkipValue();

        expect(virtualScrolling.viewportSkipValue).toEqual(5);
      });
    });

    describe('watchViewportTakeValue', () => {
      it('should update viewportTakeValue', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.extend(ViewportTakeValue, -1, () => 10);

        expect(virtualScrolling.viewportTakeValue).toEqual(0);

        virtualScrolling.watchViewportTakeValue();

        expect(virtualScrolling.viewportTakeValue).toEqual(10);
      });
    });
  });

  describe('Methods', () => {
    describe('onRowsScrollPositionChange', () => {
      it('should change scroll position', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();

        expect(virtualScrolling.scrollPosition).toEqual({
          top: 0,
          left: 0,
        });

        virtualScrolling.onRowsScrollPositionChange({
          top: 10,
          left: 0,
        });

        expect(virtualScrolling.scrollPosition).toEqual({
          top: 10,
          left: 0,
        });

        virtualScrolling.onRowsScrollPositionChange({
          top: 10,
          left: 20,
        });

        expect(virtualScrolling.scrollPosition).toEqual({
          top: 10,
          left: 20,
        });
      });

      it('should call loadViewport', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.loadViewport = jest.fn();

        virtualScrolling.onRowsScrollPositionChange({
          top: 10,
          left: 0,
        });

        expect(virtualScrolling.loadViewport).toBeCalled();
      });

      it('should not call loadViewport', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.loadViewport = jest.fn();

        virtualScrolling.onRowsScrollPositionChange({
          top: 0,
          left: 0,
        });

        expect(virtualScrolling.loadViewport).not.toBeCalled();
      });
    });

    describe('loadViewport', () => {
      it('pageSize, skip, take are not defined', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        const setPageIndex = jest.fn();
        const setLoadPageCount = jest.fn();
        virtualScrolling.plugins.set(SetPageIndex, setPageIndex);
        virtualScrolling.plugins.set(SetLoadPageCount, setLoadPageCount);

        virtualScrolling.loadViewport();

        expect(setPageIndex).toBeCalledWith(0);
        expect(setLoadPageCount).toBeCalledWith(0);
      });

      it('pageSize = all, skip and take are not defined', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        const setPageIndex = jest.fn();
        const setLoadPageCount = jest.fn();
        virtualScrolling.plugins.set(PageSize, 'all');
        virtualScrolling.plugins.set(SetPageIndex, setPageIndex);
        virtualScrolling.plugins.set(SetLoadPageCount, setLoadPageCount);

        virtualScrolling.loadViewport();

        expect(setPageIndex).toBeCalledWith(0);
        expect(setLoadPageCount).toBeCalledWith(0);
      });

      it('pageSize and skip are defined and take is not defined', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        const setPageIndex = jest.fn();
        const setLoadPageCount = jest.fn();
        virtualScrolling.plugins.set(PageSize, 20);
        virtualScrolling.viewportSkipValue = 10;
        virtualScrolling.plugins.set(SetPageIndex, setPageIndex);
        virtualScrolling.plugins.set(SetLoadPageCount, setLoadPageCount);

        virtualScrolling.loadViewport();

        expect(setPageIndex).toBeCalledWith(0);
        expect(setLoadPageCount).toBeCalledWith(1);
      });

      it('pageSize, skip and take are defined', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        const setPageIndex = jest.fn();
        const setLoadPageCount = jest.fn();
        virtualScrolling.plugins.set(PageSize, 20);
        virtualScrolling.viewportSkipValue = 25;
        virtualScrolling.viewportTakeValue = 35;
        virtualScrolling.plugins.set(SetPageIndex, setPageIndex);
        virtualScrolling.plugins.set(SetLoadPageCount, setLoadPageCount);

        virtualScrolling.loadViewport();

        expect(setPageIndex).toBeCalledWith(1);
        expect(setLoadPageCount).toBeCalledWith(2);
      });
    });

    describe('onRowsViewContentRender', () => {
      it('visibleRowHeights should be updated', () => {
        setWindow({ getComputedStyle: () => ({ height: '30px' }) }, true);
        const element = {
          querySelectorAll: () => [{} as any, {} as any, {} as any],
        };
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());

        virtualScrolling.onRowsViewContentRender(element as any);

        expect(virtualScrolling.visibleRowHeights).toEqual([30, 30, 30]);
      });

      it('updateRowHeights should be celled', () => {
        setWindow({ getComputedStyle: () => ({ height: '30px' }) }, true);
        const element = {
          querySelectorAll: () => [{} as any, {} as any, {} as any],
        };
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.updateRowHeights = jest.fn();

        virtualScrolling.onRowsViewContentRender(element as any);

        expect(virtualScrolling.updateRowHeights).toBeCalled();
      });
    });

    describe('updateRowHeights', () => {
      it('rowHeight should be updated and visibleRows, skip are not defined', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins.extend(VisibleRows, -1, () => undefined);
        virtualScrolling.plugins.extend(ViewportSkipValue, -1, () => undefined);
        virtualScrolling.visibleRowHeights = [30, 40, 50];

        virtualScrolling.updateRowHeights();

        expect(virtualScrolling.rowHeight).toEqual(20);
      });

      it('rowHeight should be updated and skip is not defined', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.extend(VisibleRows, -1, () => [
          { data: {} }, { data: {} }, { data: [] },
        ]);
        virtualScrolling.visibleRowHeights = [30, 40, 50];

        virtualScrolling.updateRowHeights();

        expect(virtualScrolling.rowHeight).toEqual(40);
      });

      it('rowHeight should be updated', () => {
        const virtualScrolling = new VirtualScrolling(new VirtualScrollingProps());
        virtualScrolling.plugins = new Plugins();
        virtualScrolling.plugins.extend(ViewportSkipValue, -1, () => 1);
        virtualScrolling.plugins.extend(VisibleRows, -1, () => [
          { data: {} }, { data: {} }, { data: [] },
        ]);
        virtualScrolling.visibleRowHeights = [30, 40, 50];

        virtualScrolling.updateRowHeights();

        expect(virtualScrolling.rowHeight).toEqual(40);
      });
    });
  });
});
