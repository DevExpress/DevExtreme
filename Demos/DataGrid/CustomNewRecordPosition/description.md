The DataGrid API includes the [newRowPosition](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#newRowPosition) property that allows you to set one of the following predefined new record positions:

- *"viewportTop"* (default)           
Insert a new row at the top of the viewport.

- *"viewportBottom"*          
Insert a new row at the bottom of the viewport.

- *"pageTop"*         
Insert a new row at the top of the current page. In virtual and infinite [scrolling modes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/scrolling/#mode), *"pageTop"* works like *"viewportTop"*. 

- *"pageBottom"*        
Insert a new row at the bottom of the current page. In virtual and infinite scrolling modes, *"pageBottom"* works like *"viewportBottom"*. 

- *"first"*           
Navigate to the beginning of the dataset and insert a new row at the top.

- *"last"*            
Navigate to the end of the dataset and insert a new row at the bottom. Does not apply in infinite scrolling mode.

In this demo, you can use a drop-down menu to change the **newRowPosition** property value at runtime. To see how your choice affects the new record position, click the "Add a row" button in the toolbar. This demo also allows you to switch between the standard and virtual scrolling modes, and to see how the **newRowPosition** property works with them.

If you want to position new records with more flexibility, you can specify a key before/after which a new record should be inserted. To do this, set the [insertBeforeKey](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/#insertBeforeKey) or [insertAfterKey](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/#insertAfterKey) property in the array of pending [changes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/). In this demo, each row contains an "Add row" button that inserts a new row after the current row. The **insertAfterKey** property is used to implement this functionality. Review the button's **onClick** event handler for more information.

A new record remains in the specified position only until it is saved. After that, the DataGrid reloads data and sorts all records. As a result, the saved record may appear out of the viewport. To navigate to it, call the [navigateToRow(key)](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#navigateToRowkey) method from the [onRowInserted](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowInserted) event handler as shown in this demo. As an alternative, you can set the [refreshMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#refreshMode) to *"repaint"*. In this case, the record keeps its custom position after being saved. However, the position may be changed when data is shaped the next time.