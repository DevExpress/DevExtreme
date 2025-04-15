import React, { memo } from 'react';
import 'devextreme-react/select-box';
import { Form, RequiredRule, SimpleItem } from 'devextreme-react/form';
import { mealPlans, roomTypes } from './data.js';

const RoomMealPlanForm = memo(({ formData, validationGroup }) => (
  <React.Fragment>
    <p>
      Review room types that can accommodate your group size and make your selection. You can also
      choose a meal plan, whether it's breakfast only or full board.
    </p>

    <Form
      formData={formData}
      validationGroup={validationGroup}
      colCount={2}
    >
      <SimpleItem
        dataField="roomType"
        isRequired
        editorType="dxSelectBox"
        label={{ text: 'Room Type', location: 'top' }}
        editorOptions={{ items: roomTypes }}
      >
        <RequiredRule />
      </SimpleItem>
      <SimpleItem
        dataField="mealPlan"
        isRequired
        editorType="dxSelectBox"
        label={{ text: 'Meal Plan', location: 'top' }}
        editorOptions={{ items: mealPlans }}
      >
        <RequiredRule />
      </SimpleItem>
    </Form>
  </React.Fragment>
));
RoomMealPlanForm.displayName = 'RoomMealPlanForm';
export default RoomMealPlanForm;
