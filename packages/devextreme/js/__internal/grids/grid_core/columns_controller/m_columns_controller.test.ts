import {
  describe, expect, it, jest,
} from '@jest/globals';

import type { ColumnsController } from './m_columns_controller';
import { ColumnsController as ColumnsControllerClass } from './m_columns_controller';

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
      if (optionName === 'columns') return config.columns ?? [];
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

describe('Methods', () => {
  describe('getVisibleDataColumnsByBandColumn', () => {
    it('should return only visible data columns', () => {
      const columns = [
        {
          caption: 'Band',
          columns: [
            { dataField: 'field1' },
            { dataField: 'field2', visible: false },
            { dataField: 'field3' },
          ],
        },
      ];

      const controller = createRealColumnsController({ columns });
      const bandColumn = controller.getColumns()[0];
      const result = controller.getVisibleDataColumnsByBandColumn(bandColumn.index);

      expect(result).toHaveLength(2);
      expect(result.map((c) => c.dataField as string)).toEqual(['field1', 'field3']);
    });

    it('should recursively get data columns from nested bands', () => {
      const columns = [
        {
          caption: 'Band 1',
          columns: [
            { dataField: 'field1' },
            {
              caption: 'Band 2',
              columns: [
                { dataField: 'field2' },
                { dataField: 'field3' },
              ],
            },
          ],
        },
      ];

      const controller = createRealColumnsController({ columns });
      const bandColumn = controller.getColumns()[0];
      const result = controller.getVisibleDataColumnsByBandColumn(bandColumn.index);

      expect(result).toHaveLength(3);
      expect(result.map((c) => c.dataField as string)).toEqual(['field1', 'field2', 'field3']);
    });

    it('should exclude grouped columns without showWhenGrouped', () => {
      const columns = [
        {
          caption: 'Band',
          columns: [
            { dataField: 'field1', groupIndex: 0 },
            { dataField: 'field2', groupIndex: 0, showWhenGrouped: true },
            { dataField: 'field3' },
          ],
        },
      ];

      const controller = createRealColumnsController({ columns });
      const bandColumn = controller.getColumns()[0];
      const result = controller.getVisibleDataColumnsByBandColumn(bandColumn.index);

      expect(result).toHaveLength(2);
      expect(result.map((c) => c.dataField as string)).toEqual(['field2', 'field3']);
    });
  });
});
