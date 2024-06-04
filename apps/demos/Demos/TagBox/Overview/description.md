The [TagBox](/Documentation/ApiReference/UI_Components/dxTagBox/) component allows users to select multiple items from a drop-down list. This demo illustrates the following TagBox properties:

- [items](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/items/)  
  An array of items to display in the drop-down list. Do not use the **items** property and the **dataSource** property in the same configuration.

- [dataSource](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#dataSource)  
  Binds the TagBox to a [data source](/Documentation/ApiReference/Data_Layer/DataSource/), which allows you to perform complex data operations. Do not use the **dataSource** property and the **items** property in the same configuration.

- [searchEnabled](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#searchEnabled)  
  Enables interactive item search.

- [showSelectionControls](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#showSelectionControls)  
  Enables item selection controls.

- [applyValueMode](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#applyValueMode)  
  Specifies whether TagBox applies the selection instantly or after a confirmation.

- [hideSelectedItems](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#hideSelectedItems)  
  Specifies whether TagBox removes selected items from the drop-down list.

- [multiline](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#multiline)  
  Specifies whether TagBox enables horizontal scrolling when the input field cannot fit all selected items.

- [acceptCustomValue](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#acceptCustomValue)  
  Allows users to enter custom values. To enable this capability, implement the [onCustomItemCreating](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#onCustomItemCreating) handler.

- [placeholder](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#placeholder)  
  Sets the value of the placeholder string.

- [value](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#value)  
  Specifies the list of currently selected items.

- [disabled](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#disabled)  
  Specifies whether the component responds to user interaction.

- [itemTemplate](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#itemTemplate)  
  Allows you to customize the appearance and content of list items.

- [tagTemplate](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#tagTemplate)
  Allows you to customize the appearance and content of list item tooltips.

To get started with the DevExtreme TagBox component, refer to the following tutorial for step-by-step instructions: [Getting Started with TagBox](/Documentation/Guide/UI_Components/TagBox/Getting_Started_with_TagBox/).