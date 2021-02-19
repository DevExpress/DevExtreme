The [SelectBox](/Documentation/ApiReference/UI_Components/dxSelectBox/) component allows users to select an item from a drop-down list. This demo illustrates the following  SelectBox properties:

- [items](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#items)    
Specifies an array of items displayed in the SelectBox.
- [placeholder](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#placeholder)       
Specifies the text that is displayed when no items are selected.
- [readOnly](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#readOnly)     
Prevents users from changing the editor's value via the UI.
- [disabled](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#disabled)        
Specifies whether the SelectBox responds to user interaction.
- [dataSource](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#dataSource)        
Binds the SelectBox to data. Unlike the **items** property, **dataSource** accepts the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object that allows users to sort, filter, group, and shape data.
- [fieldTemplate](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#fieldTemplate) and [itemTemplate](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#itemTemplate)       
Allow you to customize the text field and drop-down list items.
- [onValueChanged](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#onValueChanged) event handler      
Use this function to perform an action when a user chooses a new value. In this demo, this function is used to display the selected value.