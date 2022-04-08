import React, { createRef } from 'react';
import { mount } from 'enzyme';
import {
  emit, fakeClickEvent, clear, EVENT,
} from '../../../../../test_utils/events_mock';
import {
  SetExpanded, IsExpanded,
} from '../plugins';
import {
  ExpandColumn, ExpandColumnProps, viewFunction as ExpandColumnView,
} from '../expand_column';
import {
  KeyExprPlugin,
} from '../../plugins';

describe('Expand column', () => {
  describe('View', () => {
    it('default render when isExpanded prop equal true', () => {
      const viewProps = {
        props: new ExpandColumnProps(),
        isExpanded: true,
      } as Partial<ExpandColumn>;

      const tree = mount(<ExpandColumnView {...viewProps as any} />, {
        attachTo: document.createElement('tr'),
      });
      expect(tree.find('td').hasClass('dx-command-expand dx-datagrid-group-space dx-datagrid-expand')).toBe(true);
      expect(tree.find('div').hasClass('dx-datagrid-group-opened')).toBe(true);
      expect(tree.find('div').hasClass('dx-datagrid-group-closed')).toBe(false);
    });

    it('default render when isExpanded prop equal false', () => {
      const viewProps = {
        props: new ExpandColumnProps(),
        isExpanded: false,
      } as Partial<ExpandColumn>;

      const tree = mount(<ExpandColumnView {...viewProps as any} />, {
        attachTo: document.createElement('tr'),
      });
      expect(tree.find('td').hasClass('dx-command-expand dx-datagrid-group-space dx-datagrid-expand')).toBe(true);
      expect(tree.find('div').hasClass('dx-datagrid-group-closed')).toBe(true);
      expect(tree.find('div').hasClass('dx-datagrid-group-opened')).toBe(false);
    });
  });

  describe('Effects', () => {
    beforeEach(clear);

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('watchKeyExpr', () => {
      it('should update keyExpr', () => {
        const expandColumn = new ExpandColumn({ data: {} });
        expandColumn.plugins.set(KeyExprPlugin, 'some someId');
        expandColumn.watchKeyExpr();

        expect(expandColumn.keyExpr).toEqual('some someId');
      });
    });

    describe('updateIsExpanded', () => {
      it('should update isExpanded prop', () => {
        const expandColumn = new ExpandColumn({
          data: {
            id: 1,
          },
        });
        expandColumn.keyExpr = 'id';

        const isExpanded = (key: number) => key === 1;
        expandColumn.plugins.set(IsExpanded, isExpanded);
        expandColumn.updateIsExpanded();

        expect(expandColumn.isExpanded).toBe(true);
      });
    });

    describe('subscribeToRowClick', () => {
      it('should subscribe to click event', () => {
        const expandColumn = new ExpandColumn({ data: {} });
        expandColumn.cellRef = createRef() as any;
        expandColumn.onExpandColumnClick = jest.fn();
        expandColumn.subscribeToRowClick();

        emit(EVENT.dxClick, fakeClickEvent, expandColumn.cellRef.current);

        expect(expandColumn.onExpandColumnClick).toBeCalled();
      });

      it('should return unsubscribe callback', () => {
        const expandColumn = new ExpandColumn({ data: {} });
        expandColumn.cellRef = createRef() as any;
        expandColumn.onExpandColumnClick = jest.fn();
        const dispose = expandColumn.subscribeToRowClick();
        dispose();

        emit(EVENT.dxClick);

        expect(expandColumn.onExpandColumnClick).not.toBeCalled();
      });
    });
  });

  describe('Events', () => {
    describe('onExpandColumnClick', () => {
      it('should call onExpandColumnClick', () => {
        const expandColumn = new ExpandColumn({
          data: {
            id: 1,
          },
        });
        expandColumn.keyExpr = 'id';

        const setExpanded = jest.fn();
        expandColumn.plugins.set(SetExpanded, setExpanded);

        expandColumn.onExpandColumnClick({
          target: {
            closest: () => true,
          },
        } as any);
        expect(setExpanded).toBeCalledTimes(1);
        expect(setExpanded.mock.calls[0][0]).toEqual(1);
        expect(setExpanded.mock.calls[0][1]).toBe(!expandColumn.isExpanded);
      });

      it('should not call onExpandColumnClick', () => {
        const expandColumn = new ExpandColumn({
          data: {
            id: 1,
          },
        });
        expandColumn.keyExpr = 'id';

        const setExpanded = jest.fn();
        expandColumn.plugins.set(SetExpanded, setExpanded);

        expandColumn.onExpandColumnClick({
          target: {
            closest: () => false,
          },
        } as any);
        expect(setExpanded).toBeCalledTimes(0);
      });
    });
  });
});
