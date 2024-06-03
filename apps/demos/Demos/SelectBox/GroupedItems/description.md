Data items in the SelectBox's drop-down list can be organized in groups.
<!--split-->

If the data source contains ungrouped data items, use the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/)'s [group](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#group) property to specify the data field to group by. This case is illustrated in this demo's first and third SelectBoxes.

The SelectBox can also work with initially grouped data items. In this case, the data array should contain objects with the **key** and **items** fields:

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

If data objects are grouped but use other field names, implement the **DataSource**'s [map](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#map) function to create **key** and **items** field mappings as in this demo's second SelectBox.

[note]Only one-level grouping is supported.

Regardless of the data source structure, enable the [grouped](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#grouped) property.

If the data source contains objects, specify the following SelectBox properties:

* [valueExpr](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#valueExpr)            
A data field that contains unique values used to identify items.

* [displayExpr](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#displayExpr)             
A data field whose values should be displayed in the drop-down list.

If you need to specify a custom template for group captions, use the [groupTemplate](/Documentation/ApiReference/UI_Components/dxSelectBox/Configuration/#groupTemplate) property. In this demo, each caption contains an icon and a text string.
