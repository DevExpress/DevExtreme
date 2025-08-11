import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { Properties as DataGridProperties } from '../../../../ui/data_grid';
import DataGrid from '../../../../ui/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
  detailCell: 'dx-master-detail-cell',
  detailContainer: 'dx-datagrid-master-detail-container',
};

const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{ $container: dxElementWrapper; instance: DataGrid }> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);

  const contentReadyHandler = (): void => {
    resolve({ $container, instance });
    instance.off('contentReady', contentReadyHandler);
  };

  instance.on('contentReady', contentReadyHandler);
});

describe('GridCore master_detail', () => {
  afterEach(() => {
    const $container = $(SELECTORS.gridContainer);
    const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

    dataGrid.dispose();
    $container.remove();
  });

  describe('master detail container', () => {
    it('container is td element', async () => {
      let containerElement: HTMLElement | undefined;

      await createDataGrid({
        columns: ['field1', 'field2'],
        dataSource: [{ field1: 'value1', field2: 'value2' }],
        masterDetail: {
          enabled: true,
          autoExpandAll: true,
          template: (container) => {
            containerElement = container;
          },
        },
      });

      expect(containerElement?.tagName).toBe('TD');
      expect(containerElement?.classList).toContain(SELECTORS.detailCell);
    });

    it('container is div element when sticky columns enabled', async () => {
      let containerElement: HTMLElement | undefined;

      await createDataGrid({
        columns: [{ dataField: 'field1', fixed: true }, 'field2'],
        dataSource: [{ field1: 'value1', field2: 'value2' }],
        masterDetail: {
          enabled: true,
          autoExpandAll: true,
          template: (container) => {
            containerElement = container;
          },
        },
      });

      expect(containerElement?.parentElement?.tagName).toBe('TD');
      expect(containerElement?.parentElement?.classList).toContain(SELECTORS.detailCell);
      expect(containerElement?.tagName).toBe('DIV');
      expect(containerElement?.classList).toContain(SELECTORS.detailContainer);
    });
  });
});
