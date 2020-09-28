This demo illustrates how you can allow end-users to reorder, add, and remove tabs within the DevExtreme [TabPanel](/Documentation/ApiReference/UI_Widgets/dxTabPanel/) widget.     

**Reorder Items**       
Wrap the **TabPanel** into the [Sortable](/Documentation/ApiReference/UI_Widgets/dxSortable/) widget and set the following options as needed:

- [filter](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#filter)
Specify a CSS selector to indicate draggable items. This demo sets filter to `.dx-tab`.

- [itemOrientation](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#itemOrientation)
Set this options to *"horizontal."* When a user drags a tab, remaining items move left and right to designate the drop target.

- [onReorder](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#onReorder)
Implement this handler to synchronize the dataSource with reordered tabs.

- [moveItemOnDrop](/Documentation/ApiReference/UI_Widgets/dxSortable/Configuration/#moveItemOnDrop)
Set this option to **true** to update markup after a tab is dropped.

**Add or remove tabs**      
This demo adds and removes tabs in the following two functions:

- `addButtonHandler` - a click handler for the *"Add Tab"* button.
- `closeButtonHandler` - a click handler for a tab's Close icon. The demo uses the [itemTitleTemplate](/Documentation/ApiReference/UI_Widgets/dxTabPanel/Configuration/#itemTitleTemplate) option to display this icon.

Both handlers modify the **TabPanel**'s [dataSource](/Documentation/ApiReference/UI_Widgets/dxTabPanel/Configuration/#dataSource).