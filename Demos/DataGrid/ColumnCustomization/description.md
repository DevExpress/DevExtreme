Users can do the following to customize grid columns at runtime:

**Reorder Columns**         
Drag the column's header to reorder the column.

* Component property: [allowColumnReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnReordering)
* Column property: [allowReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowReordering)

**Resize columns**         
Drag the edge of the column's header to resize the column.

* Component property: [allowColumnResizing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnResizing)
* Related functionality:  [columnAutoWidth](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#columnAutoWidth) - resizes grid columns to automatically fit the content

**Fix (pin) columns**         
Invoke a context menu in a column's header and specify whether to fix the column to the left or right. The fixed column remains visible when users scroll the view horizontally.

* Component property: **columnFixing**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnFixing/#enabled)
* Column property: **columns[]**.[fixed](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixed) - if enabled, fixes a column to the left; **columns[]**.[fixedPosition](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixedPosition) - specifies whether to fix a column to the left or right

**Show and hide columns**        
Click the Column Chooser button to access hidden columns. Drag the column's header between the Column Chooser and the grid to change the column's visibility.

* Component property: **columnChooser**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/#enabled)
* Column property: **columns[]**.[visible](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#visible)
