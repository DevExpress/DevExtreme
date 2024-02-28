The [Sortable](/Documentation/ApiReference/UI_Components/dxSortable/) component allows users to reorder elements using drag and drop.  In this demo, two different Sortables (identified by the `class` attribute) are used:

- `sortable-lists`        
This Sortable allows users to reorder card lists. It nests `<div>` elements that represent the lists. The [handle](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#handle) property specifies that lists can be dragged by their titles. To correctly animate items being reordered, Sortable requires the item orientation. The [itemOrientation](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#itemOrientation) property is set to *"horizontal"* because card lists are orientated horizontally.

- `sortable-cards`         
This Sortable allows users to reorder cards. It nests `<div>` elements that represent all cards in a specific list. All Sortables are added to the same [group](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#group) to allow users to move cards between lists.

When a user moves an element in the UI, you need to move the corresponding data object in code. Handle events to implement this functionality. These events depend on your use-case. In this demo, we handle the [onDragStart](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#onDragStart) and [onAdd](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#onAdd) events for Sortable with the `sortable-lists` class and the [onReorder](/Documentation/ApiReference/UI_Components/dxSortable/Configuration/#onReorder) event for both Sortables.

In addition to Sortable, this kanban board implementation uses the [ScrollView](/Demos/WidgetsGallery/Demo/ScrollView/Overview/) component. The component's instance with the `scrollable-board` class allows you to scroll the board left to right. The component's instance with the `scrollable-list` class makes lists scrollable.