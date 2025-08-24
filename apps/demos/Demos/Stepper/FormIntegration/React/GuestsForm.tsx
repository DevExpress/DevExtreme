import React, { FC, memo } from 'react';
import { Form, RangeRule, SimpleItem } from 'devextreme-react/form';
import 'devextreme-react/number-box';

import { FormProps } from './types.ts';

const GuestsForm: FC<FormProps> = memo(({ formData, validationGroup }) => (
  <>
    <p>
      Enter the number of adults, children, and pets staying in the room. This information help us suggest suitable room types, number of beds, and included amenities.
    </p>

    <Form formData={formData} validationGroup={validationGroup} colCount={3}>
      <SimpleItem
        isRequired
        dataField='adultsCount'
        editorType='dxNumberBox'
        editorOptions={{
          elementAttr: { id: 'adultsCount' },
          showSpinButtons: true,
          min: 0,
          max: 5
        }}
        label={{ text: 'Adults', location: 'top' }}
      >
        <RangeRule min={1} />
      </SimpleItem>
      <SimpleItem
        dataField='childrenCount'
        editorType='dxNumberBox'
        editorOptions={{ showSpinButtons: true, min: 0, max: 5 }}
        label={{ text: 'Children', location: 'top' }}
      />
      <SimpleItem
        dataField='petsCount'
        editorType='dxNumberBox'
        editorOptions={{ showSpinButtons: true, min: 0, max: 5 }}
        label={{ text: 'Pets', location: 'top' }}
      />
    </Form>
  </>
));

GuestsForm.displayName = 'GuestsForm';

export default GuestsForm;
