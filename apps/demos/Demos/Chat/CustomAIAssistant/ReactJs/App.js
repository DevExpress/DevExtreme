import React, { useCallback, useState } from 'react';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-react/common/core/localization';
import EmployeeForm from './EmployeeForm.js';
import TaskGrid from './TaskGrid.js';
import AiAssistant from './AiAssistant.js';
import { createAiIntegration } from './ai-service.js';

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
  const [form, setForm] = useState(null);
  const [grid, setGrid] = useState(null);
  const [aiIntegration] = useState(createAiIntegration);
  const onFormInitialized = useCallback((instance) => setForm(instance), []);
  const onGridInitialized = useCallback((instance) => setGrid(instance), []);
  return (
    <>
      <EmployeeForm
        aiIntegration={aiIntegration}
        onInitialized={onFormInitialized}
      />
      <TaskGrid onInitialized={onGridInitialized} />
      <AiAssistant
        form={form}
        grid={grid}
        aiIntegration={aiIntegration}
      />
    </>
  );
}
