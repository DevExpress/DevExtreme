This demo illustrates some of the properties that allow you to customize the [Sortable](/Documentation/ApiReference/UI_Components/dxSortable/) component's behavior.

- [dropFeedbackMode](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#dropFeedbackMode)    
  Specifies how to highlight the item's drop position.

- [itemOrientation](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#itemOrientation)    
  Notifies the Sortable about item layout so that it can properly re-position items or the drop indicator during drag and drop.

- [dragDirection](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#dragDirection)    
  Specifies the directions in which an item can be dragged.

- [scrollSpeed](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#scrollSpeed)    
  Specifies the scrolling speed when dragging an item beyond the viewport.

- [scrollSensivity](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#scrollSensitivity)    
  Specifies the distance in pixels from the edge of viewport at which scrolling should start.    
  The value should not be more than half the Sortable's height or width depending on items' orientation.

- [handle](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#handle)    
  Specifies an element that should act as a drag handle for an item. A CSS selector (id or class) is used to reference the element. If not specified, users can drag any part of the item.
  
- [dragTemplate](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#dragTemplate)    
  Specifies custom markup to be shown instead of the item being dragged.