The TreeList allows users to drag and drop nodes. Use the icons in the leftmost column as the drag handles.

To configure node drag and drop, follow these steps:

1. **Allow users to reorder nodes**         
In the [rowDragging][0] object, set the [allowReordering][1] property to **true**. You can use the "Allow Reordering" checkbox under the TreeList to try this property.

1. **Allow users to change the node hierarchy**           
Enable the [allowDropInsideItem][4] property to allow users to drop one node onto another, thus adding it as the target node's child. If the property is disabled, users can only drop nodes in between others. You can use the "Allow Drop Inside Item" checkbox under the TreeList to try this property.

1. **Reorder nodes in code**        
In the [onReorder][2] function, change the parent ID of the reordered node and the node's index in the data array. If the node was dropped onto another node, changing the parent ID is sufficient. [Refresh()][5] the TreeList after these manipulations.

1. **Prevent a node from being moved inside its child node**        
Moving a parent node inside its own child node breaks the hierarchy. Prevent this situation in the **onDragChange** function. Cycle through the target node's parents. If the parent's and source node's IDs are equal, `cancel` the ability to drop the node.

1. **Show or hide drag icons** (optional)       
Users use the icons as drag handles. To hide them, set the [showDragIcons][6] property to **false**. In this case, the drag handles are the rows themselves. Use the "Show Drag Icons" checkbox under the TreeList to try this property.

[0]: /Documentation/ApiReference/UI_Components/dxTreeList/Configuration/rowDragging/
[1]: /Documentation/ApiReference/UI_Components/dxTreeList/Configuration/rowDragging/#allowReordering
[2]: /Documentation/ApiReference/UI_Components/dxTreeList/Configuration/rowDragging/#onReorder
[3]: /Documentation/ApiReference/UI_Components/dxTreeList/Configuration/rowDragging/#onDragChange
[4]: /Documentation/ApiReference/UI_Components/dxTreeList/Configuration/rowDragging/#allowDropInsideItem
[5]: /Documentation/ApiReference/UI_Components/dxTreeList/Methods/#refresh
[6]: /Documentation/ApiReference/UI_Components/dxTreeList/Configuration/rowDragging/#showDragIcons
