import React, { memo } from 'react';
import type { FC } from 'react';
import 'devextreme/ui/date_range_box';
import { Form, SimpleItem } from 'devextreme-react/form';

import type { FormProps } from './types.ts';

const editorOptions = {
  startDatePlaceholder: 'Check-in',
  endDatePlaceholder: 'Check-out',
  elementAttr: { id: 'datesPicker' },
};
const label = { visible: false };

const DatesForm: FC<FormProps> = memo(({ formData, validationGroup }: FormProps) => (
  <>
    <p>
      Select your check-in and check-out dates. If your dates are flexible, include that information in Additional Requests. We will do our best to suggest best pricing options, depending on room availability.
    </p>
    <Form formData={formData} validationGroup={validationGroup}>
      <SimpleItem
        isRequired
        dataField='dates'
        editorType='dxDateRangeBox'
        editorOptions={editorOptions}
        label={label}
      />
    </Form>
  </>
));

DatesForm.displayName = 'DatesForm';

export default DatesForm;
