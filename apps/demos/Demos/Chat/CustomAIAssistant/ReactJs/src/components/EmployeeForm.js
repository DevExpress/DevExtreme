import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { Form, Item, ButtonItem } from 'devextreme-react/form';
import { Toast } from 'devextreme-react/toast';
import {
  employee, positions, states, titles,
} from '../data/data.js';

const saveButtonOptions = {
  text: 'Save',
  type: 'default',
  disabled: true,
  useSubmitBehavior: true,
  width: 120,
};
const titleLabel = { text: 'Title' };
const firstNameLabel = { text: 'First Name' };
const lastNameLabel = { text: 'Last Name' };
const selectBoxOptions = { searchEnabled: true };
const prefixEditorOptions = { ...selectBoxOptions, items: titles };
const positionEditorOptions = { ...selectBoxOptions, items: positions };
const stateEditorOptions = { ...selectBoxOptions, items: states };
const birthDateEditorOptions = { displayFormat: 'M/d/yyyy' };
const toastPosition = {
  of: '#form-container',
  at: { x: 'center', y: 'bottom' },
  my: { x: 'center', y: 'bottom' },
  offset: { x: 0, y: -20 },
};
const prefixAIOptions = { instruction: 'Only fill this field with one of the allowed values (Mr., Mrs., Ms.) if a title is explicitly mentioned in the text. Never use this field for any part of a person\'s name.' };
const firstNameAIOptions = { instruction: "Only fill this field if the text clearly refers to a person's given name. Never use grid/task-related words like Subject, Priority, Status, Due Date, Completion, or generic verbs like sort/filter/show as a name." };
const lastNameAIOptions = { instruction: "If the text gives a full person name (e.g. 'customer name', 'employee name') without separately labeled first/last names, use only the first word as First Name and the rest of the name as Last Name." };
const positionAIOptions = { instruction: "Only fill this field with one of the allowed job position values if the text explicitly refers to the employee's own job title/role." };
const stateAIOptions = { instruction: "Only fill this field with one of the allowed US state values if the text explicitly refers to the employee's home/office state." };
const birthDateAIOptions = { instruction: "Only fill this field if the text explicitly refers to the employee's own birth date or date of birth." };
export default function EmployeeForm({ aiIntegration, onInitialized }) {
  const formRef = useRef(null);
  const [toastVisible, setToastVisible] = useState(false);
  const onOptionChanged = useCallback((event) => {
    if (event.name === 'isDirty') {
      formRef.current?.instance().getButton('Save')?.option('disabled', !event.value);
    }
  }, []);
  const onSave = useCallback(() => setToastVisible(true), []);
  const onToastHiding = useCallback(() => setToastVisible(false), []);
  const onFormInitialized = useCallback((event) => {
    if (event.component) {
      onInitialized(event.component);
    }
  }, [onInitialized]);
  const buttonOptions = useMemo(() => ({ ...saveButtonOptions, onClick: onSave }), [onSave]);
  return (<div id="form-container">
    <Form ref={formRef} formData={employee} colCount={3} labelLocation="top" aiIntegration={aiIntegration} onOptionChanged={onOptionChanged} onInitialized={onFormInitialized}>
      <Item dataField="Prefix" label={titleLabel} editorType="dxSelectBox" editorOptions={prefixEditorOptions} aiOptions={prefixAIOptions} />
      <Item dataField="FirstName" label={firstNameLabel} aiOptions={firstNameAIOptions} />
      <Item dataField="LastName" label={lastNameLabel} aiOptions={lastNameAIOptions} />
      <Item dataField="Position" editorType="dxSelectBox" editorOptions={positionEditorOptions} aiOptions={positionAIOptions} />
      <Item dataField="State" editorType="dxSelectBox" editorOptions={stateEditorOptions} aiOptions={stateAIOptions} />
      <Item dataField="BirthDate" editorType="dxDateBox" editorOptions={birthDateEditorOptions} aiOptions={birthDateAIOptions} />
      <ButtonItem name="Save" colSpan={3} cssClass="save-button" buttonOptions={buttonOptions} />
    </Form>
    <Toast visible={toastVisible} message="Form data is saved." type="success" displayTime={600} closeOnClick={true} position={toastPosition} onHiding={onToastHiding} />
  </div>);
}
