DevExtreme CardView allows users to edit data within a pop-up edit form. To start editing a card, click the Edit button within the card header (only one card can be edited at any point in time). The pop-up edit form can include any field from the component data source (the corresponding column does not need to be visible within the CardView - see the `Notes` field in this demo).
<!--split-->

To enable card editing, set the following [editing](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/) properties to `true`:
- **editing**.[allowUpdating](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowUpdating)
- **editing**.[allowAdding](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowAdding)
- **editing**.[allowDeleting](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#allowDeleting)

CardView uses DevExtreme [Form](/Documentation/ApiReference/UI_Components/dxForm/) and [Popup](/Documentation/ApiReference/UI_Components/dxPopup/) components to display the form and the popup. Default configurations are defined automatically. If these configurations do not meet your requirements, you can redefine them in the **editing** object's [form](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#form) and [popup](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/editing/#popup) properties as demonstrated in this demo.