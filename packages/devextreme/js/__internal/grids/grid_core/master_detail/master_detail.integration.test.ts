import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../__tests__/__mock__/helpers/utils';

const SELECTORS = {
  detailCell: 'dx-master-detail-cell',
  detailContainer: 'dx-datagrid-master-detail-container',
};

describe('GridCore master_detail', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('master detail container', () => {
    it('container is td element', async () => {
      // eslint-disable-next-line @typescript-eslint/init-declarations
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
      // eslint-disable-next-line @typescript-eslint/init-declarations
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

  describe('expanded state', () => {
    const template = (): void => {};
    const dataSource = [{ id: 1 }, { id: 2 }];

    it('expands every row when autoExpandAll is true', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        masterDetail: { enabled: true, autoExpandAll: true, template },
      });

      expect(instance.isRowExpanded(1)).toBe(true);
      expect(instance.isRowExpanded(2)).toBe(true);
    });

    it('collapses every row when autoExpandAll is set to false', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        masterDetail: { enabled: true, autoExpandAll: true, template },
      });

      instance.option('masterDetail.autoExpandAll', false);
      jest.runAllTimers();

      expect(instance.isRowExpanded(1)).toBe(false);
      expect(instance.isRowExpanded(2)).toBe(false);
    });

    it('collapses an expanded row when the template changes', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        masterDetail: { enabled: true, template },
      });

      await instance.expandRow(1);
      jest.runAllTimers();
      expect(instance.isRowExpanded(1)).toBe(true);

      instance.option('masterDetail.template', (): void => {});
      jest.runAllTimers();

      expect(instance.isRowExpanded(1)).toBe(false);
    });

    it('collapses an expanded row when enabled changes', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        masterDetail: { enabled: true, template },
      });

      await instance.expandRow(1);
      jest.runAllTimers();
      instance.option('masterDetail.enabled', false);
      jest.runAllTimers();

      expect(instance.isRowExpanded(1)).toBe(false);
    });

    it('keeps an expanded row when the masterDetail object keeps enabled and autoExpandAll', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        masterDetail: { enabled: true, template },
      });

      await instance.expandRow(1);
      jest.runAllTimers();
      instance.option('masterDetail', { enabled: true, autoExpandAll: false, template });
      jest.runAllTimers();

      expect(instance.isRowExpanded(1)).toBe(true);
      expect(instance.isRowExpanded(2)).toBe(false);
    });
  });
});
