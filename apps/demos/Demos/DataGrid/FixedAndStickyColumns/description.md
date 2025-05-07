A horizontal scrollbar appears when the total width of all grid columns exceeds the DevExtreme DataGrid’s overall width. To maintain column visibility when scrolling horizontally, set the **columnFixing**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnFixing/#enabled) property to `true`.

To fix a column programmatically, set its [fixed](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixed) property to `true` and specify the desired [fixedPosition](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixedPosition):

- *'left'* (default if `fixed: true`)    
The column is fixed to the leftmost edge of the grid.

- *'right'*    
The column is fixed to the rightmost edge of the grid.

- *'sticky'*    
The column "sticks" to the left or rightmost edge when it reaches either side of the grid.

To fix (or unfix) a column, right-click a column header and select the desired operation using the DataGrid’s built-in context menu. To prevent users from fixing/unfixing a column, set its [allowFixing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowFixing) property to `false`.
<!--split-->