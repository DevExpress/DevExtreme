import React, { memo } from 'react';
import 'devextreme/ui/text_area';
import { Form, SimpleItem } from 'devextreme-react/form';

const editorOptions = {
  height: 160,
  elementAttr: { id: 'additionalRequest' },
};
const label = { visible: false };
const AdditionalForm = memo(({ formData }) => (
  <>
    <div>Please let us know if you have any other requests.</div>
    <Form formData={formData}>
      <SimpleItem
        dataField="additionalRequest"
        editorType="dxTextArea"
        editorOptions={editorOptions}
        label={label}
      ></SimpleItem>
    </Form>
  </>
));
AdditionalForm.displayName = 'AdditionalForm';
export default AdditionalForm;
