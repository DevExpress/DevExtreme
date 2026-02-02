import {
  describe, expect, it, jest,
} from '@jest/globals';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import { ColumnsController as ColumnsControllerClass } from '../columns_controller/m_columns_controller';
import { needToRemoveColumnBorder } from './utils';

interface ControllerConfig {
  columns?: object[];
  options?: Record<string, unknown>;
}

interface ComponentMock {
  option: jest.Mock<(optionName: string) => unknown>;
  _createComponent: jest.Mock;
  element: jest.Mock<() => { jquery: boolean }>;
  _controllers: {
    data: { getDataSource: jest.Mock<() => null> };
    focus: Record<string, never>;
    stateStoring: Record<string, never>;
  };
}

const createRealColumnsController = (config: ControllerConfig): ColumnsController => {
  const componentMock: ComponentMock = {
    option: jest.fn((optionName: string) => {
      if (optionName === 'columns') {
        return config.columns ?? [];
      }

      return config.options?.[optionName];
    }),
    _createComponent: jest.fn(),
    element: jest.fn(() => ({
      jquery: true,
    })),
    _controllers: {
      data: { getDataSource: jest.fn(() => null) },
      focus: {},
      stateStoring: {},
    },
  };

  const controller = new ColumnsControllerClass(componentMock);
  controller.init();

  return controller;
};

describe('needToRemoveColumnBorder', () => {
  it('should not check parent column for grouped column', () => {
    const columns = [
      {
        dataField: 'field1',
        fixed: true,
      },
      {
        caption: 'Band Column',
        columns: [{
          dataField: 'field2',
          groupIndex: 0,
        }, {
          dataField: 'field3',
        }],
      },
    ];

    const controller = createRealColumnsController({ columns });
    const groupExpandColumn = controller.getVisibleColumns()[0];

    expect(groupExpandColumn.type).toBe('groupExpand');
    expect(needToRemoveColumnBorder(controller, groupExpandColumn, 0))
      .toBe(false);
  });

  it('should return false for grouped column with showWhenGrouped', () => {
    const columns = [
      {
        dataField: 'field1',
        fixed: true,
      },
      {
        caption: 'Band Column',
        columns: [{
          dataField: 'field2',
          groupIndex: 0,
          showWhenGrouped: true,
        }, {
          dataField: 'field3',
        }],
      },
    ];

    const controller = createRealColumnsController({ columns });
    const visibleColumns = controller.getVisibleColumns();
    const groupExpandColumn = visibleColumns[0];
    const groupedColumn = visibleColumns[2];

    expect(groupExpandColumn.type).toBe('groupExpand');
    expect(needToRemoveColumnBorder(controller, groupExpandColumn, 0))
      .toBe(false);

    expect(groupedColumn.dataField).toBe('field2');
    expect(needToRemoveColumnBorder(controller, groupedColumn, 0))
      .toBe(true);
  });
});
