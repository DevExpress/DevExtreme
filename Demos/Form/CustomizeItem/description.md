You can use the [items[]](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#items) array to configure all form items. This array can contain strings ([formData](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#formData) field names) and objects (item configurations). 

Use a string to create a simple item with default configuration as shown for the `Email` item. 

To change the default settings, declare an item configuration object. Use the [dataField](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/#dataField) property to bind an item to a field in the **formData** object. Use the [editorType](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/#editorType) property to specify an item's data editor or configure the editor in the [editorOptions](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/#editorOptions) object. You can also specify any other properties described in the [SimpleItem](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/) section.

This demo shows how to specify **editorOptions**, **editorType**, [validationRules](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/#validationRules), and [colSpan](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/#colSpan) properties for simple items in a Form component.
