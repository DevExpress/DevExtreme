The [TagBox](/Documentation/ApiReference/UI_Components/dxTagBox/) allows users to select multiple items from a drop-down list. This demo illustrates the following TagBox properties:

- [items](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/items/)  
  An array of items displayed by the TagBox.

- [searchEnabled](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#searchEnabled)  
  Specifies whether the search is enabled.

- [showSelectionControls](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#showSelectionControls)  
  Defines whether to display the selection controls.

- [applyValueMode](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#applyValueMode)  
  Specifies whether selected values are applied instantly or when a user clicks the **OK** button.

- [hideSelectedItems](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#hideSelectedItems)  
  Specifies whether the selected items are removed from the drop-down list.

- [multiline](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#multiline)  
  Displays selected items on single or multiple lines.

- [acceptCustomValue](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#acceptCustomValue)  
  Specifies whether users can enter custom values. Requires that you also implement the [onCustomItemCreating](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#onCustomItemCreating) handler.

- [placeholder](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#placeholder)  
  Customizes the TagBox placeholder.

- [value](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#value)  
  Specifies items the TagBox currently displays.

- [disabled](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#disabled)  
  Defines whether the component responds to user interaction.

- [dataSource](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#dataSource)  
  Binds the TagBox to data. Unlike the **items** property, **dataSource** accepts the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object that allows users to sort, filter, group, and shape data. Note that you cannot use **items** and **dataSource** simultaneously.

- [itemTemplate](/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#itemTemplate)  
  Allows you to customize the drop-down list items.
