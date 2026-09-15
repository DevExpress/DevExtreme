import React, { useCallback, useEffect, useState } from 'react';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-react/common/core/localization';
import EmployeeForm from './components/EmployeeForm.js';
import TaskGrid from './components/TaskGrid.js';
import AiAssistant from './components/AiAssistant.js';
import { createAiIntegration } from './services/ai-service.js';

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
  const [form, setForm] = useState(null);
  const [grid, setGrid] = useState(null);
  const onFormInitialized = useCallback((instance) => setForm(instance), []);
  const onGridInitialized = useCallback((instance) => setGrid(instance), []);
  useEffect(() => {
    if (!form || !grid) {
      return undefined;
    }
    window.customAIAssistantTestApi = {
      getFormData: () => form.option('formData'),
      getGridFilterValue: () => grid.option('filterValue'),
      getGridSortOrder: (columnDataField) => grid.columnOption(columnDataField, 'sortOrder'),
      getVisibleDueDates: () => grid.getVisibleRows().map((row) => String(row.data.DueDate)),
    };
    return () => {
      delete window.customAIAssistantTestApi;
    };
  }, [form, grid]);
  return (<>
    <EmployeeForm aiIntegration={aiIntegration} onInitialized={onFormInitialized}/>
    <TaskGrid onInitialized={onGridInitialized}/>
    <AiAssistant form={form} grid={grid} aiIntegration={aiIntegration}/>
  </>);
}
