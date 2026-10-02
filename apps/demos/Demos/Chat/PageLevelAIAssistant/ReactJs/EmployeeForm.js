import React, { useCallback, useMemo, useState } from 'react';
import { Form, SimpleItem, ButtonItem } from 'devextreme-react/form';
import { Position, Toast } from 'devextreme-react/toast';
import { employee, formFieldsConfig } from './data.js';

const bottomCenterPosition = { x: 'center', y: 'bottom' };
const saveButtonOptions = {
  text: 'Save',
  type: 'default',
  disabled: true,
  useSubmitBehavior: true,
  width: 120,
};
export default function EmployeeForm({ aiIntegration, formRef }) {
  const [formData] = useState(() => ({ ...employee }));
  const [toastVisible, setToastVisible] = useState(false);
  const onOptionChanged = useCallback((event) => {
    if (event.name === 'isDirty') {
      event.component.getButton('Save')?.option('disabled', !event.value);
    }
  }, []);
  const onSave = useCallback(() => {
    formRef?.current?.instance().reset(formData);
    setToastVisible(true);
  }, [formData, formRef]);
  const onToastHiding = useCallback(() => setToastVisible(false), []);
  const buttonOptions = useMemo(() => ({ ...saveButtonOptions, onClick: onSave }), [onSave]);
  return (
    <div id="form-container">
      <Form
        ref={formRef}
        formData={formData}
        colCount={3}
        labelLocation="top"
        aiIntegration={aiIntegration}
        onOptionChanged={onOptionChanged}
      >
        {formFieldsConfig.map((field) => (
          <SimpleItem
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
        onHiding={onToastHiding}
      >
        <Position
          of="#form-container"
          at={bottomCenterPosition}
          my={bottomCenterPosition}
          offset="0 -20"
        />
      </Toast>
    </div>
  );
}
