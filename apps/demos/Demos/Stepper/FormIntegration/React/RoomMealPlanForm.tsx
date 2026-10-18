import React, { memo } from 'react';
import type { FC } from 'react';
import 'devextreme/ui/select_box';
import { Form, SimpleItem } from 'devextreme-react/form';

import type { FormProps } from './types.ts';
import { mealPlans, roomTypes } from './data.ts';

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

const RoomMealPlanForm: FC<FormProps> = memo(({ formData, validationGroup }: FormProps) => (
  <>
    <p>
      Review room types that can accommodate your group size and make your selection. You can also choose a meal plan, whether it's breakfast only or full board.
    </p>

    <Form formData={formData} validationGroup={validationGroup} colCount={2}>
      <SimpleItem
        dataField='roomType'
        isRequired
        editorType='dxSelectBox'
        label={roomTypeLabel}
        editorOptions={roomTypeEditorOptions}
      />
      <SimpleItem
        dataField='mealPlan'
        isRequired
        editorType='dxSelectBox'
        label={mealPlanLabel}
        editorOptions={mealPlanEditorOptions}
      />
    </Form>
  </>
));

RoomMealPlanForm.displayName = 'RoomMealPlanForm';

export default RoomMealPlanForm;
