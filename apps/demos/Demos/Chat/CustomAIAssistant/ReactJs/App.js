import React, { useRef, useState } from 'react';
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
  const formRef = useRef(null);
  const gridRef = useRef(null);
  const [aiIntegration] = useState(createAiIntegration);
  return (
    <>
      <EmployeeForm
        aiIntegration={aiIntegration}
        formRef={formRef}
      />
      <TaskGrid gridRef={gridRef} />
      <AiAssistant
        formRef={formRef}
        gridRef={gridRef}
        aiIntegration={aiIntegration}
      />
    </>
  );
}
