import React, { useCallback, useMemo, useState } from 'react';
import { Form, Item, ButtonItem } from 'devextreme-react/form';
import { Toast } from 'devextreme-react/toast';
import { employee, formFieldsConfig } from './data.js';

const saveButtonOptions = {
  text: 'Save',
  type: 'default',
  disabled: true,
  useSubmitBehavior: true,
  width: 120,
};
const toastPosition = {
  of: '#form-container',
  at: { x: 'center', y: 'bottom' },
  my: { x: 'center', y: 'bottom' },
  offset: { x: 0, y: -20 },
};
export default function EmployeeForm({ aiIntegration, formRef }) {
  const [toastVisible, setToastVisible] = useState(false);
  const setFormRef = useCallback(
    (instance) => {
      formRef.current = instance;
    },
    [formRef],
  );
  const onOptionChanged = useCallback(
    (event) => {
      if (event.name === 'isDirty') {
        formRef.current?.instance().getButton('Save')?.option('disabled', !event.value);
      }
    },
    [formRef],
  );
  const onSave = useCallback(() => setToastVisible(true), []);
  const onToastHiding = useCallback(() => setToastVisible(false), []);
  const buttonOptions = useMemo(() => ({ ...saveButtonOptions, onClick: onSave }), [onSave]);
  return (
    <div id="form-container">
      <Form
        ref={setFormRef}
        formData={employee}
        colCount={3}
        labelLocation="top"
        aiIntegration={aiIntegration}
        onOptionChanged={onOptionChanged}
      >
        {formFieldsConfig.map((field) => (
          <Item
            key={field.dataField}
            {...field}
          />
        ))}
        <ButtonItem
          name="Save"
          colSpan={3}
          cssClass="save-button"
          buttonOptions={buttonOptions}
        />
      </Form>
      <Toast
        visible={toastVisible}
        message="Form data is saved."
        type="success"
        displayTime={600}
        closeOnClick={true}
        position={toastPosition}
        onHiding={onToastHiding}
      />
    </div>
  );
}
