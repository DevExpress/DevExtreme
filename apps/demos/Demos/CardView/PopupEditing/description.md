CardView can display a popup edit form. The form can include any fields from the bound data source, regardless of whether the corresponding column is visible in the grid (see the `Notes` and `Address` columns).

To enable this behavior in your application, set the following properties to `true`:
- [editing](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/).[allowUpdating](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowUpdating)
- **editing**.[allowAdding](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowAdding)
- **editing**.[allowDeleting](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowDeleting)
<!--split-->

CardView uses the DevExtreme [Form](/Documentation/ApiReference/UI_Components/dxForm/) and [Popup](/Documentation/ApiReference/UI_Components/dxPopup/) components to display the form and the popup. Their default configurations are defined automatically. If these configurations do not meet your requirements, you can redefine them in the **editing** object's [form](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#form) and [popup](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#popup) properties as shown in this demo.