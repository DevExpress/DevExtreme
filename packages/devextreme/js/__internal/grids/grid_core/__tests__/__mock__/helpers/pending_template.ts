import { jest } from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

import type { DataGridInstance } from './utils';
import { createDataGrid } from './utils';

interface TemplateArgs {
  model: { value: unknown };
  container: HTMLElement;
  onRendered?: () => void;
}

interface PendingTemplate {
  template: { render: (args: TemplateArgs) => void };
  renderPendingTemplates: () => void;
}

export const ROWS = [{ id: 1 }, { id: 2 }, { id: 3 }];

export const createPendingTemplate = (): PendingTemplate => {
  const pendingTemplates: (() => void)[] = [];

  return {
    template: {
      render({ model, container, onRendered }: TemplateArgs): void {
        pendingTemplates.push(() => {
          container.append(String(model.value));
          onRendered?.();
        });
      },
    },
    renderPendingTemplates: (): void => {
      while (pendingTemplates.length) {
        pendingTemplates.shift()?.();
        jest.runAllTimers();
      }
    },
  };
};

export const createGridWithPendingTemplates = async (
  options: DataGridProperties,
): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGridInstance;
  renderPendingTemplates: () => void;
}> => {
  const { template, renderPendingTemplates } = createPendingTemplate();

  const grid = await createDataGrid({
    dataSource: ROWS,
    columns: [{ dataField: 'id', cellTemplate: 'cellTemplate' }],
    templatesRenderAsynchronously: true,
    integrationOptions: {
      templates: { cellTemplate: template },
    },
    ...options,
  } as DataGridProperties);

  return { ...grid, renderPendingTemplates };
};
