The [Form](/Documentation/ApiReference/UI_Components/dxForm/) component allows you to add/remove items and specify item visibility at runtime. The Form only updates the affected items and does not re-render the entire form.

In this demo, the "Show Address" checkbox specifies the visibility of address-related fields. Review the component's code to see how to set the "HomeAddress" group's [visible](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/GroupItem/#visible) attribute.

Click the "Add phone" button to add a new phone editor. This action adds a new item to the [items](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/GroupItem/#items) array of the "phones" group. Each phone editor contains a button that deletes it from the **items** array and the Form.