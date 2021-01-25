If you enable deferred row selection, the grid does not request selected rows' data with every selection change. For example, if a user clicks the checkbox in the column header to select all the rows, the grid does not immediately fetch all data from the server. This is helpful in the following cases:

- You process data on the server and do not want to load the selected rows' data.
- You do process selected records on the client, but want to reduce the number of requests that are sent.

This demo illustrates the second scenario. Deferred selection is enabled and the selected rows are only requested when you click the button below the grid.

To enable deferred selection in your application, set the **selection**.[deferred](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#deferred) property to **true**.

To specify the initially selected rows, use the [selectionFilter](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#selectionFilter) property. The UI component updates this property's value at runtime and you can always access the applied filter. In this demo, the **selectionFilter** selects rows whose `Status` is `Completed`.

To load the selected rows' data, call the [getSelectedRowsData()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#getSelectedRowsData) method. In deferred selection mode, this method returns a Promise. You can access row data in its fulfillment handler. In this demo, the **getSelectedRowsData()** method gets data objects that are then used to calculate statistics for the selected tasks.