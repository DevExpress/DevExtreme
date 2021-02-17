Data items in the SelectBox's drop-down list can be organized in groups.

If the data source provides data items ungrouped, use the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/)'s [group](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#group) property to specify the data field to group by. This case is illustrated in this demo.

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

If data objects are grouped but use other field names, implement the **DataSource**'s [map](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#map) function to create **key** + **items** field mappings.

[note]Subgroups are not supported.