import React, { useRef, useState } from 'react';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-react/common/core/localization';
import type { DataGridRef } from 'devextreme-react/data-grid';
import type { FormRef } from 'devextreme-react/form';
import EmployeeForm from './EmployeeForm.tsx';
import TaskGrid from './TaskGrid.tsx';
import AiAssistant from './AiAssistant.tsx';
import { createAiIntegration } from './ai-service.ts';

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
  const formRef = useRef({ current: null as FormRef | null });
  const gridRef = useRef({ current: null as DataGridRef | null });
  const [aiIntegration] = useState(createAiIntegration);

  return (
    <>
      <EmployeeForm aiIntegration={aiIntegration} formRef={formRef.current} />
      <TaskGrid gridRef={gridRef.current} />
      <AiAssistant formRef={formRef.current} gridRef={gridRef.current} aiIntegration={aiIntegration} />
    </>
  );
}
