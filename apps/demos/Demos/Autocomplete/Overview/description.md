Autocomplete is a text box that displays suggestions while a user types. This demo shows how to customize the Autocomplete component and handle value changes.

## Bind Autocomplete to Data

Use one of the following properties to supply data to the component:

* [items[]](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/items/)             
Accepts a local data array.

* [dataSource](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#dataSource)            
Accepts a local data array, [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object, or DevExtreme data store. In this demo, every Autocomplete component is bound to a local array, except the following components:

    - "Custom Item Template and Data Source Usage"    
    Uses an [ODataStore](/Documentation/ApiReference/Data_Layer/ODataStore/).
    
    - "Custom Store and Search Options"    
    Uses a [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/).

The [value](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#value) property stores the selected item. You can use the same property to select an item programmatically, as shown in the "Disabled" Autocomplete component.

If the data source contains objects, you should specify the [valueExpr](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#valueExpr) property. It accepts a data field name that uniquely identifies each data object. In this demo, [valueExpr](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#valueExpr) is specified only for the "Custom Item Template and Data Source Usage" and "Custom Store and Search Options" components because other components are bound to arrays of primitive values.

## Configure Search Parameters

When a user types the first character, Autocomplete displays suggestions. To increase the number of characters that triggers suggestions, use the [minSearchLength](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#minSearchLength) property. You can also specify the time interval Autocomplete should wait before it displays suggestions. Assign this time interval in milliseconds to the [searchTimeout](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#searchTimeout) property. See the "Custom Store and Search Options" Autocomplete component for an example.

In most cases, the data field that supplies Autocomplete with suggestions is the same data field that is used to search for the entered text. If you use two different fields, assign the field that supplies Autocomplete with suggestions to the [valueExpr](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#valueExpr) property and the field used to search to the [searchExpr](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#searchExpr) property. Note that [searchExpr](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#searchExpr) also accepts arrays if you want to search multiple fields.

## Handle Value Change

To handle value changes, implement the [onValueChanged](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#onValueChanged) function. In this demo, we use [onValueChanged](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#onValueChanged) to display the values of all Autocomplete components.

## Appearance Customization

You can specify the following properties to customize the Autocomplete component's appearance:

* [placeholder](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#placeholder)             
The text that is displayed when Autocomplete is empty. 

* [showClearButton](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#showClearButton)            
Adds a Clear button that empties the Autocomplete value as shown in the "With Clear Button" Autocomplete component. 

* [disabled](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#disabled)            
Disables the component.

* [itemTemplate](/Documentation/ApiReference/UI_Components/dxAutocomplete/Configuration/#itemTemplate)            
Customizes the appearance of the Autocomplete suggestions. See the "Custom Item Template and Data Source Usage" component for an example.

