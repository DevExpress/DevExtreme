import React, { FC, memo } from 'react';
import 'devextreme-react/date-range-box';
import { Form, SimpleItem } from 'devextreme-react/form';

import { FormProps } from './types.ts';

const DatesForm: FC<FormProps> = memo(({ formData, validationGroup }) => (
  <React.Fragment>
    <p>
      Select your check-in and check-out dates. If your dates are flexible, include that information in Additional Requests. We will do our best to suggest best pricing options, depending on room availability.
    </p>
    <Form formData={formData} validationGroup={validationGroup}>
      <SimpleItem
        isRequired
        dataField='dates'
        editorType='dxDateRangeBox'
        editorOptions={{
          startDatePlaceholder: 'Check-in',
          endDatePlaceholder: 'Check-out',
          elementAttr: { id: 'datesPicker' },
        }}
        label={{ visible: false }}
      />
    </Form>
  </React.Fragment>
));

DatesForm.displayName = 'DatesForm';

export default DatesForm;
