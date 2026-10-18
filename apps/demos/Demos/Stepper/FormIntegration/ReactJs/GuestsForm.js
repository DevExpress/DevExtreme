import React, { memo } from 'react';
import { Form, RangeRule, SimpleItem } from 'devextreme-react/form';

const adultsEditorOptions = {
  elementAttr: { id: 'adultsCount' },
  showSpinButtons: true,
  min: 0,
  max: 5,
};
const childrenEditorOptions = { showSpinButtons: true, min: 0, max: 5 };
const petsEditorOptions = { showSpinButtons: true, min: 0, max: 5 };
const adultsLabel = { text: 'Adults', location: 'top' };
const childrenLabel = { text: 'Children', location: 'top' };
const petsLabel = { text: 'Pets', location: 'top' };
const GuestsForm = memo(({ formData, validationGroup }) => (
  <>
    <p>
      Enter the number of adults, children, and pets staying in the room. This information help us
      suggest suitable room types, number of beds, and included amenities.
    </p>

    <Form
      formData={formData}
      validationGroup={validationGroup}
      colCount={3}
    >
      <SimpleItem
        isRequired
        dataField="adultsCount"
        editorType="dxNumberBox"
        editorOptions={adultsEditorOptions}
        label={adultsLabel}
      >
        <RangeRule min={1} />
      </SimpleItem>
      <SimpleItem
        dataField="childrenCount"
        editorType="dxNumberBox"
        editorOptions={childrenEditorOptions}
        label={childrenLabel}
      />
      <SimpleItem
        dataField="petsCount"
        editorType="dxNumberBox"
        editorOptions={petsEditorOptions}
        label={petsLabel}
      />
    </Form>
  </>
));
GuestsForm.displayName = 'GuestsForm';
export default GuestsForm;
