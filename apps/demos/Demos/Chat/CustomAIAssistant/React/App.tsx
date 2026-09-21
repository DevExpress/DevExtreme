import React, { useCallback, useState } from 'react';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-react/common/core/localization';
import EmployeeForm from './EmployeeForm.tsx';
import TaskGrid from './TaskGrid.tsx';
import AiAssistant from './AiAssistant.tsx';
import { createAiIntegration } from './ai-service.ts';
import type { EmployeeForm as EmployeeFormInstance, TaskGrid as TaskGridInstance } from './data.ts';

loadMessages({ en: { 'dxChat-textareaPlaceholder': 'Enter a prompt...' } });
config({
  editorStylingMode: 'filled',
  floatingActionButtonConfig: {
    position: {
      my: 'right bottom',
      at: 'right bottom',
      of: '#grid-container',
      offset: '-16 -16',
    },
  },
});
export default function App() {
  const [form, setForm] = useState<EmployeeFormInstance | null>(null);
  const [grid, setGrid] = useState<TaskGridInstance | null>(null);
  const [aiIntegration] = useState(createAiIntegration);

  const onFormInitialized = useCallback((instance: EmployeeFormInstance): void => setForm(instance), []);
  const onGridInitialized = useCallback((instance: TaskGridInstance): void => setGrid(instance), []);

  return (
    <>
      <EmployeeForm aiIntegration={aiIntegration} onInitialized={onFormInitialized} />
      <TaskGrid onInitialized={onGridInitialized} />
      <AiAssistant form={form} grid={grid} aiIntegration={aiIntegration} />
    </>
  );
}
