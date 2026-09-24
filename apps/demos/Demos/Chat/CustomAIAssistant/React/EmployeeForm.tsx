import React, { useCallback, useMemo, useState } from 'react';
import { Form, SimpleItem, ButtonItem } from 'devextreme-react/form';
import type { FormTypes } from 'devextreme-react/form';
import type { ButtonTypes } from 'devextreme-react/button';

import { Toast } from 'devextreme-react/toast';
import { employee, formFieldsConfig } from './data.ts';
import type { EmployeeFormProps } from './data.ts';

const saveButtonOptions: ButtonTypes.Properties = {
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
} as const;

export default function EmployeeForm({ aiIntegration, formRef }: EmployeeFormProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const onOptionChanged = useCallback((event: FormTypes.OptionChangedEvent): void => {
    if (event.name === 'isDirty') {
      event.component.getButton('Save')?.option('disabled', !event.value);
    }
  }, []);

  const onSave = useCallback((): void => setToastVisible(true), []);
  const onToastHiding = useCallback((): void => setToastVisible(false), []);
  const buttonOptions = useMemo(() => ({ ...saveButtonOptions, onClick: onSave }), [onSave]);

  return (
    <div id="form-container">
      <Form
        ref={formRef}
        formData={employee}
        colCount={3}
        labelLocation="top"
        aiIntegration={aiIntegration}
        onOptionChanged={onOptionChanged}
      >
        {formFieldsConfig.map((field) => <SimpleItem key={field.dataField} {...field} />)}
        <ButtonItem name="Save" colSpan={3} cssClass="save-button" buttonOptions={buttonOptions} />
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
