To bind the TreeList to a hierarchical array, do the following:

1. Assign the array to the [dataSource](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#dataSource) property.

2. Set the [dataStructure](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#dataStructure) property to *"tree"*.

3. Use the [itemsExpr](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#itemsExpr) property to specify the data field that contains nested items.

4. If each data item has a Boolean field that specifies whether this data item nests other items, assign the field's name to the [hasItemsExpr](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#hasItemsExpr) property. The TreeList uses this information to render the expand button. This is required only if the UI component is bound to a remote data source.
