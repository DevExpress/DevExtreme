The Lookup component allows users to search through its drop-down list and select a single item. The drop-down list can be grouped by category.
<!--split-->

### Bind the Component to Data
To bind the component to data, use one of these properties:

* [items[]](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#items)                
Accepts a local data array (see the Simple Lookup code below).

* [dataSource](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#dataSource)             
Accepts a local data array or a [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object. This object works with local and remote arrays and allows you to shape data. In this demo, a DataSource instance is configured to group a local array of objects (see the Grouped Lookup code below).

Both properties work with arrays of primitives or objects. If you use objects, specify the following properties:

* [valueExpr](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#valueExpr)          
A data field that contains unique values used to identify items.

* [displayExpr](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#displayExpr)          
A data field whose values should be displayed in the drop-down list.

When a user selects an item, the Lookup component saves the corresponding value from the **valueExpr** data field in the [value](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#value) property. You can also specify the **value** property in code to preselect an item as shown in the Simple Lookup use case.

### Group Data
You can group data items in the drop-down list.

If the data source contains ungrouped data items, use the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/)'s [group](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#group) property to specify the data field to group by.

The Lookup component can also work with initially grouped data items. In this case, the data array should contain objects with the **key** and **items** fields:

    let dataSource = [{
        key: "Group 1", // Group caption 
        items: [ // Items in Group 1
            { /* ... */ },
            { /* ... */ }
        ]
    }, {
        key: "Group 2",
        items: [
            { /* ... */ },
            { /* ... */ }
        ]
    }];

If data objects are grouped but use other field names, implement the **DataSource**'s [map](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#map) function to create **key** and **items** field mappings.

[note]Only one-level grouping is supported.

Regardless of the data source structure, enable the [grouped](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#grouped) property.

### Configure the Drop-Down List
The Lookup component uses the [Popover](/Documentation/ApiReference/UI_Components/dxPopover/) component as a drop-down list. To customize the Popover, use the [dropDownOptions](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#dropDownOptions) property. It accepts an object with [Popover properties](/Documentation/ApiReference/UI_Components/dxPopover/Configuration/). Alternatively, you can set the [usePopover](/Documentation/ApiReference/UI_Components/dxLookup/Configuration/#usePopover) property to **false** to display lookup items in a pop-up window.
