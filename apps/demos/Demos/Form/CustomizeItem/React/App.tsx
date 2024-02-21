import React, { useCallback } from 'react';
import 'devextreme-react/text-area';

import Form, {
  Item, GroupItem, Label, FormTypes,
} from 'devextreme-react/form';
import { ValidationRule } from 'devextreme/common';
import LabelTemplate from './LabelTemplate.tsx';
import LabelNotesTemplate from './LabelNotesTemplate.tsx';
import service from './data.ts';

const employee = service.getEmployee();

const validationRules: {
  position: ValidationRule[],
  hireDate: ValidationRule[]
} = {
  position: [
    { type: 'required', message: 'Position is required.' },
  ],
  hireDate: [
    { type: 'required', message: 'Hire Date is required.' },
  ],
};

const nameEditorOptions = { disabled: true };
const positionEditorOptions = { items: service.getPositions(), searchEnabled: true, value: '' };
const hireDateEditorOptions = { width: '100%', value: null };
const birthDateEditorOptions = { width: '100%', disabled: true };
const notesEditorOptions = { height: 90, maxLength: 200 };
const phoneEditorOptions = { mask: '+1 (X00) 000-0000', maskRules: { X: /[02-9]/ } };

const App = () => {
  const validateForm = useCallback((e: FormTypes.ContentReadyEvent) => {
    e.component.validate();
  }, []);

  return (
    <Form
      onContentReady={validateForm}
      formData={employee}>
      <GroupItem colCount={2} caption="Employee Details">
        <Item dataField="FirstName" editorOptions={nameEditorOptions}>
          <Label render={LabelTemplate('user')} />
        </Item>
        <Item dataField="Position" editorType="dxSelectBox" editorOptions={positionEditorOptions} validationRules={validationRules.position}>
          <Label render={LabelTemplate('info')} />
        </Item>
        <Item dataField="LastName" editorOptions={nameEditorOptions}>
          <Label render={LabelTemplate('user')} />
        </Item>
        <Item dataField="HireDate" editorType="dxDateBox" editorOptions={hireDateEditorOptions} validationRules={validationRules.hireDate}>
          <Label render={LabelTemplate('event')} />
        </Item>
        <Item dataField="BirthDate" editorType="dxDateBox" editorOptions={birthDateEditorOptions}>
          <Label render={LabelTemplate('event')} />
        </Item>
        <Item dataField="Address">
          <Label render={LabelTemplate('home')} />
        </Item>
        <Item dataField="Notes" colSpan={2} editorType="dxTextArea" editorOptions={notesEditorOptions}>
          <Label render={LabelNotesTemplate} />
        </Item>
        <Item dataField="Phone" editorOptions={phoneEditorOptions}>
          <Label render={LabelTemplate('tel')} />
        </Item>
        <Item dataField="Email">
          <Label render={LabelTemplate('email')} />
        </Item>
      </GroupItem>
    </Form>
  );
};

export default App;
