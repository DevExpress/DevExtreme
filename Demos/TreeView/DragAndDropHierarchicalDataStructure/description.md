This sample app demonstrates node drag and drop operations within DevExtreme **TreeView** when using a hierarchical data structure. You can reorder nodes within a single tree view or drag and drop nodes between two separate tree views.

Use [Sortable][0] to implement the necessary drag and drop functionality within your web app. The following steps outline configuration requirements for our JavaScript **TreeView**:

1. **Allow users to reorder nodes**     
Wrap the **TreeView** in a **Sortable** and enable the **Sortable**'s [allowReordering][1] property.

1. **Allow users to change node hierarchy**           
Enable the [allowDropInsideItem][2] property so that users can drop one node onto another. This adds it as the target node's child. If this property is disabled, users can only drop nodes between other nodes.

1. **Allow users to drag only tree view nodes**        
To specify tree view nodes as drag targets, set the [filter][3] property to a class selector. Since all tree view nodes use the `dx-treeview-node` class, you can use this class selector as needed. 

1. **Prevent a node from being moved into its child node**        
When a user moves a parent node into its own child node, it breaks the hierarchy. To prevent this outcome, implement the [onDragChange][4] function and traverse up the node tree. If the target is a child of the dragged node, `cancel` the ability to drop the node.

1. **Reorder nodes in code**        
Implement the [onDragEnd][5] function. In this function, you must gather information about nodes being moved. With this information, you can reorder the nodes in the data source (see the `moveNode` function), and reassign the data source to **the TreeView**'s  [items][6] property. 

1. **Specify tree view identifiers** (for drag and drop between multiple tree views only)     
Identifiers help distinguish between multiple tree views. Save them in the **Sortable**'s [data][7] property. The tree views below include the following identifiers: *"driveC"* and *"driveD"*.

1. **Combine tree views into one drag and drop group** (for drag and drop between multiple tree views only)    
Set the **Sortable**'s [group][8] property to the same value for all tree views. This allows users to move nodes between the tree views.  

[0]: /Documentation/ApiReference/UI_Widgets/dxSortable/
[1]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#allowReordering
[2]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#allowDropInsideItem
[3]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#filter
[4]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#onDragChange
[5]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#onDragEnd
[6]: /Documentation/ApiReference/UI_Widgets/dxTreeView/Configuration/items/
[7]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#data
[8]: /Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#group
