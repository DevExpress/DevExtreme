To bind the TreeList to an array that contains plain-structured data objects, do the following:

1. Assign the array to the [dataSource](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#dataSource) property.

2. Specify the data fields that contain node keys in the [keyExpr](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#keyExpr) property and parent node keys in the [parentIdExpr](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#parentIdExpr) property.

3. Specify the root node's key in the [rootValue](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#rootValue) property if it is not 0.

4. If each data item has a Boolean field that specifies whether this data item nests other items, assign the field's name to the [hasItemsExpr](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#hasItemsExpr) property. The TreeList uses this information to render the expand button. This is required only if the UI component is bound to a remote data source.

The TreeList builds a tree from plain data objects based on the specified properties.
