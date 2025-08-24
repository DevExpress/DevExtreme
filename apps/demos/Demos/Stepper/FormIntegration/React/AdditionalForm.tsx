import React, { FC, memo } from 'react';
import 'devextreme-react/text-area';
import { Form, SimpleItem } from 'devextreme-react/form';

import { FormProps } from './types.ts';

const AdditionalForm: FC<FormProps> = memo(({ formData }) => (
  <>
    <div>
      Please let us know if you have any other requests.
    </div>
    <Form formData={formData} >
      <SimpleItem
        dataField='additionalRequest'
        editorType='dxTextArea'
        editorOptions={{
          height: 160,
          elementAttr: { id: 'additionalRequest' },
        }}
        label={{ visible: false }}
      ></SimpleItem>
    </Form>
  </>
));

AdditionalForm.displayName = 'AdditionalForm';

export default AdditionalForm;
