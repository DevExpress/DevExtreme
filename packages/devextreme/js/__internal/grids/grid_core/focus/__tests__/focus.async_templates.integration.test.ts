import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';

import { createGridWithPendingTemplates } from '../../__tests__/__mock__/helpers/pending_template';
import { afterTest, beforeTest } from '../../__tests__/__mock__/helpers/utils';

const getRowKeys = ($container: dxElementWrapper, selector: string): number[] => {
  const container = $container.get(0) as HTMLElement;

  return Array.from(
    container.querySelectorAll(`.dx-datagrid-rowsview ${selector}`),
    (element) => Number(element.closest('tr')?.textContent),
  );
};

describe('Focused row while new rows wait for async templates', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should highlight the row focused with focusedRowKey', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      focusedRowEnabled: true,
    });

    instance.option('focusedRowKey', 2);
    jest.runAllTimers();
    renderPendingTemplates();

    expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([2]);
  });

  it('should highlight the focused row when a detail row is expanded above it', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      focusedRowEnabled: true,
      masterDetail: {
        enabled: true,
        template: (container: HTMLElement): void => {
          container.append('detail');
        },
      },
    });

    instance.option('focusedRowKey', 2);
    jest.runAllTimers();
    const expanding = instance.expandRow(1);
    jest.runAllTimers();
    renderPendingTemplates();
    await expanding;

    expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([2]);
  });

  it('should not highlight the repainted row when the focused row key is reset', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      focusedRowEnabled: true,
      focusedRowKey: 2,
    });

    renderPendingTemplates();
    instance.repaintRows([1]);
    jest.runAllTimers();
    instance.option('focusedRowKey', null);
    jest.runAllTimers();
    renderPendingTemplates();

    expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([]);
  });
});
