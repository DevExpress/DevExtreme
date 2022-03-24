import React, { createRef } from 'react';
import { mount } from 'enzyme';
import {
  emit, fakeClickEvent, clear, EVENT,
} from '../../../../../test_utils/events_mock';
import { RowClick, TableContent, viewFunction as TableContentView } from '../table_content';
import { Row, ColumnInternal } from '../../types';

describe('TableContent', () => {
  describe('View', () => {
    it('default render', () => {
      const rows: Row[] = [{ data: { id: 1, field: 'test' }, key: 1, rowType: 'data' }];
      const columns: ColumnInternal[] = [{ dataField: 'id' }, { dataField: 'field' }];

      const tableContent = new TableContent({
        dataSource: rows,
        columns,
      });

      const tree = mount(<TableContentView rows={tableContent.rows} {...tableContent as any} />);

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
        dataSource: rows,
        columns,
      });

      const tree = mount(<TableContentView rows={tableContent.rows} {...tableContent as any} />);

      expect(tree.find('table').exists()).toBe(true);
      expect(tree.find('tr').length).toBe(1);
      expect(tree.find('tr').hasClass('myRow')).toBe(true);
      expect(tree.find('tr').find('td').length).toBe(1);
      expect(tree.find('tr').find('td').text()).toBe('Test');
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
  });

  describe('Events', () => {
    describe('onRowClick', () => {
      it('should call RowClick', () => {
        const tableContent = new TableContent({});
        tableContent.props.dataSource = [{ data: {}, rowType: 'data' }, { data: {}, rowType: 'data' }, { data: {}, rowType: 'data' }];

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
        expect(rowClick.mock.calls[0][0]).toBe(tableContent.props.dataSource[0]);

        tableContent.onRowClick({ currentTarget: 'some other row' } as any);
        expect(rowClick).toBeCalledTimes(1);
      });
    });
  });
});
