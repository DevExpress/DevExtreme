The [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/#onSelectionChanged) function is executed after the selection is changed and allows you to access information about the selected items. In this demo, the function fetches selected shape information and displays it under the Diagram component.
<!--split-->

The [onContentReady](/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/#onContentReady) function is handled to find the 'Greta Sims' shape, select it, and scroll to it. For this purpose, the following methods are called:

* [getItems](/Documentation/ApiReference/UI_Components/dxDiagram/Methods/#getItems) returns an array of diagram items.
* [setSelectedItems](/Documentation/ApiReference/UI_Components/dxDiagram/Methods/#setSelectedItemsitems) selects the specified items.
* [scrollToItem](/Documentation/ApiReference/UI_Components/dxDiagram/Methods/#scrollToItemitem) scrolls the view area to the specified item.
* [focus](/Documentation/ApiReference/UI_Components/dxDiagram/Methods/#focus) focuses the Diagram.
