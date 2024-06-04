In this demo, the DataGrid allows users to select only one row at a time. To enable this mode, set the **selection**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#mode) property to *"single"*. Press Ctrl to unselect a row.
<!--split-->

You can access the selected row data from the [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSelectionChanged) function. In this demo, this function fetches the selected row's information and displays it under the grid.