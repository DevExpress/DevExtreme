import React, { createRef } from 'react';
import { mount } from 'enzyme';
import {
  emit, fakeClickEvent, clear, EVENT,
} from '../../../../../test_utils/events_mock';
import {
  RowClick, TableContent, TableContentProps, viewFunction as TableContentView, TopRowPlaceholder,
  BottomRowPlaceholder, RowsViewHeightValue, SetRowsViewContentRenderAction,
  SetRowsViewScrollPositionAction, SetRowsViewOffsetAction,
} from '../table_content';
import { NoDataText } from '../../widgets/no_data_text';
import { Row, ColumnInternal } from '../../types';
import { Scrollable } from '../../../../scroll_view/scrollable';
import { Placeholder } from '../../../../../utils/plugin/placeholder';
import { setWindow } from '../../../../../../core/utils/window';
import { Plugins } from '../../../../../utils/plugin/context';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';

describe('TableContent', () => {
  describe('View', () => {
    it('default render', () => {
      const rows: Row[] = [{ data: { id: 1, field: 'test' }, key: 1, rowType: 'data' }];
      const columns: ColumnInternal[] = [{ dataField: 'id' }, { dataField: 'field' }];

      const tableContent = new TableContent({
        visibleRows: rows,
        columns,
      });

      const tree = mount(<TableContentView rows={tableContent.rows} {...tableContent as any} />);
      const scrollable = tree.find(Scrollable);
      const placeholders = scrollable.find(Placeholder);

      expect(scrollable.exists()).toBe(true);
      expect(placeholders).toHaveLength(2);
      expect(placeholders.at(0).props().type).toBe(TopRowPlaceholder);
      expect(placeholders.at(1).props().type).toBe(BottomRowPlaceholder);
      expect(tree.find('table').exists()).toBe(true);
      expect(tree.find('tr').length).toBe(1);
      expect(tree.find('tr').find('td').length).toBe(2);
    });

    it('default render when row with template', () => {
      const rows: Row[] = [{
        data: { id: 1, field: 'test' },
        key: 1,
        rowType: 'data',
        template: () => <tr className="myRow"><td>Test</td></tr>,
      }];
      const columns: ColumnInternal[] = [{ dataField: 'id' }, { dataField: 'field' }];

      const tableContent = new TableContent({
        visibleRows: rows,
        columns,
      });

      const tree = mount(<TableContentView rows={tableContent.rows} {...tableContent as any} />);

      expect(tree.find('table').exists()).toBe(true);
      expect(tree.find('tr').length).toBe(1);
      expect(tree.find('tr').hasClass('myRow')).toBe(true);
      expect(tree.find('tr').find('td').length).toBe(1);
      expect(tree.find('tr').find('td').text()).toBe('Test');
    });

    it('empty row', () => {
      const rows: Row[] = [];
      const columns: ColumnInternal[] = [{ dataField: 'id' }, { dataField: 'field' }];

      const tableContent = new TableContent({
        visibleRows: rows,
        columns,
      } as TableContentProps);

      const tree = mount(
        <TableContentView
          rows={tableContent.rows}
          isEmpty
          {...tableContent as any}
        />,
      );

      expect(tree.find(NoDataText).exists()).toBe(true);
    });

    it('no empty row', () => {
      const rows: Row[] = [];
      const columns: ColumnInternal[] = [{ dataField: 'id' }, { dataField: 'field' }];

      const tableContent = new TableContent({
        visibleRows: rows,
        columns,
      } as TableContentProps);

      const tree = mount(
        <TableContentView
          rows={tableContent.rows}
          isEmpty={false}
          {...tableContent as any}
        />,
      );

      expect(tree.find(NoDataText).exists()).toBe(false);
    });

    it('SetRowsViewOffsetAction rendered', () => {
      const rows: Row[] = [];
      const columns: ColumnInternal[] = [{ dataField: 'id' }, { dataField: 'field' }];

      const tableContent = new TableContent({
        visibleRows: rows,
        columns,
      } as TableContentProps);

      const tree = mount(
        <TableContentView
          rows={tableContent.rows}
          isEmpty
          {...tableContent as any}
        />,
      );

      expect(tree.find(ValueSetter).props().type).toBe(SetRowsViewOffsetAction);
    });
  });

  describe('Effects', () => {
    beforeEach(clear);

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('subscribeToRowClick', () => {
      it('should subscribe to click event', () => {
        const tableContent = new TableContent({});
        tableContent.divRef = createRef() as any;
        tableContent.onRowClick = jest.fn();
        tableContent.subscribeToRowClick();

        emit(EVENT.dxClick, fakeClickEvent, tableContent.divRef.current);

        expect(tableContent.onRowClick).toBeCalled();
      });

      it('should return unsubscribe callback', () => {
        const tableContent = new TableContent({});
        tableContent.divRef = createRef() as any;
        tableContent.onRowClick = jest.fn();
        const dispose = tableContent.subscribeToRowClick();
        dispose();

        emit(EVENT.dxClick);

        expect(tableContent.onRowClick).not.toBeCalled();
      });
    });

    describe('calculateRowsViewHeight', () => {
      it('should update rows view height', () => {
        setWindow({ getComputedStyle: () => ({ height: '100px' }) }, true);
        const tableContent = new TableContent(new TableContentProps());
        tableContent.plugins = new Plugins();
        tableContent.rowsViewRef = {
          current: {} as any,
        } as any;

        tableContent.calculateRowsViewHeight();

        expect(tableContent.plugins.getValue(RowsViewHeightValue)).toEqual(100);
      });
    });

    describe('rowsViewContentReady', () => {
      it('should call view content ready action', () => {
        const tableContent = new TableContent(new TableContentProps());
        tableContent.plugins = new Plugins();
        const actionMock = jest.fn();
        tableContent.plugins.set(SetRowsViewContentRenderAction, actionMock);
        tableContent.divRef = {
          current: {
            myVal: 1,
          } as any,
        } as any;

        tableContent.rowsViewContentReady();

        expect(actionMock).toHaveBeenCalledWith({
          myVal: 1,
        });
      });
    });
  });

  describe('Events', () => {
    describe('onRowClick', () => {
      it('should call RowClick', () => {
        const tableContent = new TableContent({});
        tableContent.props.visibleRows = [{ data: {}, rowType: 'data' }, { data: {}, rowType: 'data' }, { data: {}, rowType: 'data' }];

        const rowClick = jest.fn();
        tableContent.plugins.set(RowClick, rowClick);

        const rows = [{}, {}, {}];

        tableContent.divRef = {
          current: {
            getElementsByClassName: () => rows,
          },
        } as any;

        tableContent.onRowClick({ currentTarget: rows[0] } as any);
        expect(rowClick).toBeCalledTimes(1);
        expect(rowClick.mock.calls[0][0]).toBe(tableContent.props.visibleRows[0]);

        tableContent.onRowClick({ currentTarget: 'some other row' } as any);
        expect(rowClick).toBeCalledTimes(1);
      });
    });

    describe('onScrollContent', () => {
      it('should call setRowsViewContent action', () => {
        const tableContent = new TableContent({});
        tableContent.plugins = new Plugins();
        const actionMock = jest.fn();
        tableContent.plugins.set(SetRowsViewScrollPositionAction, actionMock);
        const scrollEventsArg = {
          scrollOffset: {
            top: 10,
            left: 20,
          },
        };

        tableContent.onScrollContent(scrollEventsArg);

        expect(actionMock).toHaveBeenCalledWith(scrollEventsArg.scrollOffset);
      });
    });
  });

  describe('Actions', () => {
    describe('SetRowsViewOffsetAction', () => {
      it('should call ref scrollTo', () => {
        const tableContent = new TableContent({});
        tableContent.plugins = new Plugins();
        const scrollToRef = jest.fn();
        tableContent.scrollableRef = {
          current: {
            scrollTo: scrollToRef,
          },
        } as any;
        tableContent.plugins.set(SetRowsViewOffsetAction, tableContent.scrollTo.bind(tableContent));

        tableContent.plugins.callAction(SetRowsViewOffsetAction, { top: 10, left: 5 });

        expect(scrollToRef).toHaveBeenCalledWith({ top: 10, left: 5 });
      });

      it('call SetRowsViewOffsetAction when ref is null', () => {
        const tableContent = new TableContent({});
        tableContent.plugins = new Plugins();
        tableContent.scrollableRef = {
          current: null,
        } as any;
        tableContent.plugins.set(SetRowsViewOffsetAction, tableContent.scrollTo.bind(tableContent));

        expect(() => {
          tableContent.plugins.callAction(SetRowsViewOffsetAction, { top: 10, left: 5 });
        }).not.toThrowError();
      });
    });
  });
});
