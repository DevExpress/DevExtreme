import React, { useCallback, useEffect, useState } from 'react';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-react/common/core/localization';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import EmployeeForm from './components/EmployeeForm.tsx';
import TaskGrid from './components/TaskGrid.tsx';
import AiAssistant from './components/AiAssistant.tsx';
import { createAiIntegration } from './services/ai-service.ts';
import type { Employee, EmployeeForm as EmployeeFormInstance, TaskGrid as TaskGridInstance } from './types/types.ts';

type SortOrder = DataGridTypes.Column['sortOrder'];
interface CustomAIAssistantTestApi {
  getFormData: () => Employee;
  getGridFilterValue: () => unknown;
  getGridSortOrder: (columnDataField: string) => SortOrder | undefined;
  getVisibleDueDates: () => string[];
}

declare global {
  interface Window { customAIAssistantTestApi?: CustomAIAssistantTestApi; }
}

loadMessages({ en: { 'dxChat-textareaPlaceholder': 'Enter a prompt...' } });
config({
  floatingActionButtonConfig: {
    position: {
      my: 'right bottom',
      at: 'right bottom',
      of: '#grid-container',
      offset: '-16 -16',
    },
  },
});
const aiIntegration = createAiIntegration();

export default function App() {
  const [form, setForm] = useState<EmployeeFormInstance | null>(null);
  const [grid, setGrid] = useState<TaskGridInstance | null>(null);

  const onFormInitialized = useCallback((instance: EmployeeFormInstance): void => setForm(instance), []);
  const onGridInitialized = useCallback((instance: TaskGridInstance): void => setGrid(instance), []);

  useEffect(() => {
    if (!form || !grid) {
      return undefined;
    }

    window.customAIAssistantTestApi = {
      getFormData: () => form.option('formData') as Employee,
      getGridFilterValue: () => grid.option('filterValue'),
      getGridSortOrder: (columnDataField) => grid.columnOption(columnDataField, 'sortOrder') as SortOrder | undefined,
      getVisibleDueDates: () => grid.getVisibleRows().map((row) => String((row.data as { DueDate: string }).DueDate)),
    };

    return () => {
      delete window.customAIAssistantTestApi;
    };
  }, [form, grid]);

  return (
    <>
      <EmployeeForm aiIntegration={aiIntegration} onInitialized={onFormInitialized} />
      <TaskGrid onInitialized={onGridInitialized} />
      <AiAssistant form={form} grid={grid} aiIntegration={aiIntegration} />
    </>
  );
}
