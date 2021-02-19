Users can resize DataGrid columns if the [allowColumnResizing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnResizing) property is enabled. When a user resizes a column, the grid's behavior depends on the [columnResizingMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#columnResizingMode) property value:

* *"nextColumn"*: the DataGrid resizes the adjacent column; total component width stays the same.

* *"widget"*: the total component width increases or decreases; all other columns maintain their widths.

Use the drop-down list below the DataGrid to try both values.
