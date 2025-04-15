import React, { forwardRef } from 'react';
import 'devextreme-react/date-range-box';
import { Form, RequiredRule, SimpleItem } from 'devextreme-react/form';

const DatesForm = forwardRef(({ formData, validationGroup }, ref) => (
  <React.Fragment>
    <p>
      Select your check-in and check-out dates. If your dates are flexible, include that information
      in Additional Requests. We will do our best to suggest best pricing options, depending on room
      availability.
    </p>
    <Form
      formData={formData}
      validationGroup={validationGroup}
      ref={ref}
    >
      <SimpleItem
        isRequired
        dataField="dates"
        editorType="dxDateRangeBox"
        editorOptions={{
          startDatePlaceholder: 'Check-in',
          endDatePlaceholder: 'Check-out',
        }}
        label={{ visible: false }}
      >
        <RequiredRule />
      </SimpleItem>
    </Form>
  </React.Fragment>
));
DatesForm.displayName = 'DatesForm';
export default DatesForm;
