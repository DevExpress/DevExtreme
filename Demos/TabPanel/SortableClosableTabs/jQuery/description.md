This demo shows how to allow users to reorder, add, and remove tabs in a [TabPanel](/Documentation/ApiReference/UI_Widgets/dxTabPanel/) widget.     

**Reorder items**       
Link the [Sortable](/Documentation/ApiReference/UI_Widgets/dxSortable/) widget to the **TabPanel** and set the following options:       

- [filter](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#filter)     
Specify a CSS selector to indicate draggable items. This demo sets the filter to `.dx-tab`.

- [itemOrientation](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#itemOrientation)       
Set this options to *"horizontal"*. When a user drags a tab, the remaining items move left and right to indicate the drop target.

- [onReorder](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#onReorder)       
Implement this handler to synchronize the dataSource with the reordered tabs.

- [moveItemOnDrop](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#moveItemOnDrop)           
Set this option to **true** to update the markup after a tab is dropped.

**Add or remove tabs**      
In this demo, you can use two external buttons to add and remove tabs. These buttons call the `addButtonHandler` and `closeButtonHandler` functions that modify the **TabPanel**'s [dataSource](/Documentation/ApiReference/UI_Widgets/dxTabPanel/Configuration/#dataSource).       

You can also click a tab's Close icon to remove this tab. This icon is added via the [itemTitleTemplate](/Documentation/ApiReference/UI_Widgets/dxTabPanel/Configuration/#itemTitleTemplate) option. A click on this icon calls the `closeButtonHandler` function.