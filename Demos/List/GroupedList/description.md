The **List** component can display items as a two-level hierarchy: parent and child items. To group items, set the [grouped](/Documentation/ApiReference/UI_Components/dxList/Configuration/#grouped) property to **true** and ensure the data source defines the hierarchy in one of the following ways:

### Hierarchical Data Source Structure

You can use a [dataSource](/Documentation/ApiReference/UI_Components/dxList/Configuration/#dataSource) where each entry is an object that contains the **key** and **items** fields. The **key** field specifies the group header (parent), and the **items** field holds an array of child items. This demo shows how to use this type of data source.

A data source can specify different field names if the data is structured in the same way. In this case, implement the [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/)'s [map](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#map) function to create **key** and **items** field mappings. Refer to the following help topic for more information: [Item Mapping](/Documentation/Guide/Data_Binding/Data_Layer/#Reading_Data/Data_Transformation/Item_Mapping).

### Grouping Field

The data source can contain a plain list of objects with multiple fields. Assign a field to the DataSource's [group](/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#group) property to create a hierarchical display. Parent items display unique values from the specified field, and Child items display grouped values. 

### Group Display Settings

If you need to make the groups collapsible, set the [collapsibleGroups](/Documentation/ApiReference/UI_Components/dxList/Configuration/#collapsibleGroups) to **true**. 

You can also use the [groupTemplate](/Documentation/ApiReference/UI_Components/dxList/Configuration/#groupTemplate) property to customize the appearance of group headers.
