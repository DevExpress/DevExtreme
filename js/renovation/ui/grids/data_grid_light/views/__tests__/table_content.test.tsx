import { createRef } from 'react';
import {
  emit, fakeClickEvent, clear, EVENT,
} from '../../../../../test_utils/events_mock';
import { RowClick, TableContent } from '../table_content';

describe('TableContent', () => {
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
