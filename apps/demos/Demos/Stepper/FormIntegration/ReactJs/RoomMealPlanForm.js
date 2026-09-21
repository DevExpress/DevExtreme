import React, { memo } from 'react';
import 'devextreme/ui/select_box';
import { Form, SimpleItem } from 'devextreme-react/form';
import { mealPlans, roomTypes } from './data.js';

const roomTypeLabel = { text: 'Room Type', location: 'top' };
const mealPlanLabel = { text: 'Meal Plan', location: 'top' };
const roomTypeEditorOptions = {
  items: roomTypes,
  elementAttr: { id: 'roomType' },
};
const mealPlanEditorOptions = {
  items: mealPlans,
  elementAttr: { id: 'mealPlan' },
};
const RoomMealPlanForm = memo(({ formData, validationGroup }) => (
  <>
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
        label={roomTypeLabel}
        editorOptions={roomTypeEditorOptions}
      />
      <SimpleItem
        dataField="mealPlan"
        isRequired
        editorType="dxSelectBox"
        label={mealPlanLabel}
        editorOptions={mealPlanEditorOptions}
      />
    </Form>
  </>
));
RoomMealPlanForm.displayName = 'RoomMealPlanForm';
export default RoomMealPlanForm;
