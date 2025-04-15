import React, { memo } from 'react';
import 'devextreme-react/text-area';
import { Form, SimpleItem } from 'devextreme-react/form';

const AdditionalForm = memo(({ formData }) => (
  <React.Fragment>
    <div>Please let us know if you have any other requests.</div>
    <Form formData={formData}>
      <SimpleItem
        dataField="additionalRequest"
        editorType="dxTextArea"
        editorOptions={{ height: 160 }}
        label={{ visible: false }}
      ></SimpleItem>
    </Form>
  </React.Fragment>
));
AdditionalForm.displayName = 'AdditionalForm';
export default AdditionalForm;
