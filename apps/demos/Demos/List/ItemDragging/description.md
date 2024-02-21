This demo shows how to enable item drag and drop in the List component. You can reorder items or drag and drop them between two separate lists. Use the handles on the right side of items to initiate drag and drop.

The following steps describe how to configure this functionality:

1. **Enable item drag and drop**        
Set the [itemDragging](/Documentation/ApiReference/UI_Components/dxList/Configuration/#itemDragging).[allowReordering](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#allowReordering) to **true**.

1. **Add the lists to the same group**      
Set the [group](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#group) property of both components to the same value to allow a user to drag and drop items between them.

1. **Reorder list items in code**       
Use the [onDragStart](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#onDragStart) event handler to store the dragged item's data. When a user drops the item, the [onRemove](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#onRemove) and [onAdd](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#onAdd) functions allow you to remove the item from its initial position and add it to the new location.