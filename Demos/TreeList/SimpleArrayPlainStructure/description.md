To bind the **TreeList** to an array that contains plain-structured data objects, do the following:

1. Assign the array to the [dataSource](/Documentation/ApiReference/UI_Widgets/dxTreeList/Configuration/#dataSource) option.
1. Specify the data fields that provide node keys in the [keyExpr](/Documentation/ApiReference/UI_Widgets/dxTreeList/Configuration/#keyExpr) option and parent node keys in the [parentIdExpr](/Documentation/ApiReference/UI_Widgets/dxTreeList/Configuration/#parentIdExpr) option.
1. Specify the root node's key in the [rootValue](/Documentation/ApiReference/UI_Widgets/dxTreeList/Configuration/#rootValue) option if it is not 0.

The UI component builds a tree from plain data objects based on the specified options.