CardView allows users to edit data in a popup edit form. To start editing any card, click the Edit button in a card header. Only one card can be in the edit state at any time. The popup edit form can include any field from the component data source, regardless of whether the corresponding column is visible in the grid (see the `Notes` field).
<!--split-->

To enable card editing in your application, set the following [editing](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/) properties to `true`:
- **editing**.[allowUpdating](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowUpdating)
- **editing**.[allowAdding](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowAdding)
- **editing**.[allowDeleting](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowDeleting)

CardView uses the DevExtreme [Form](/Documentation/ApiReference/UI_Components/dxForm/) and [Popup](/Documentation/ApiReference/UI_Components/dxPopup/) components to display the form and the popup. Their default configurations are defined automatically. If these configurations do not meet your requirements, you can redefine them in the **editing** object's [form](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#form) and [popup](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#popup) properties as shown in this demo.