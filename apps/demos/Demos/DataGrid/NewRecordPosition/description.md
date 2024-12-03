The DevExtreme DataGrid API includes a [newRowPosition](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#newRowPosition) property. With this property, you can specify the desired "new record" position as follows.
<!--split-->

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

In this demo, you can use a drop-down menu to change the **newRowPosition** property value at runtime. To see how your choice affects "new record" position, click the "Add a row" button in the toolbar. This demo also allows you to switch between standard and virtual scrolling modes (you can also see how **newRowPosition** works with each scrolling mode).

If you wish to position new records in a more flexible manner, you can specify the key before/after which a new record must be inserted. To apply this feature, set the [insertBeforeKey](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/#insertBeforeKey) or [insertAfterKey](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/#insertAfterKey) property in the pending [changes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/) array. In this demo, each row contains an "Add row" button that inserts a new row after the current row. The **insertAfterKey** property is used to implement this functionality. Review the button's **onClick** event handler for more information.

A new record remains at a specified position until it is saved. Once saved, the DevExtreme DataGrid reloads data and sorts all records. As a result, the saved record may appear outside the viewport. To navigate to this record, call the [navigateToRow(key)](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#navigateToRowkey) method from the [onRowInserted](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowInserted) event handler (as illustrated in this demo). As an alternative, you can set the [refreshMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#refreshMode) to *"repaint"*. In this instance, the record retains its custom position after a save operation (however, position may change once data is shaped in the future).