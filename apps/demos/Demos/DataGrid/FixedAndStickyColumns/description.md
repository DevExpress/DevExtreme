A horizontal scrollbar appears when the total width of all columns exceeds the DataGrid component's width. To keep a column visible when scrolling, set the **columnFixing**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnFixing/#enabled) property to `true`.

To fix a column programmatically, set its [fixed](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixed) property to `true` and select the column's [fixedPosition](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixedPosition):

- *'left'* (default if `fixed: true`)    
The column is fixed to the left edge of the grid.

- *'right'*    
The column is fixed to the right edge of the grid.

- *'sticky'*    
The column sticks to left and right edges when it reaches them.

To fix or unfix a column, users should right-click the column's header and select the corresponding operation in the context menu. To prevent users from fixing or unfixing a column, set its [allowFixing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowFixing) property to `false`.
<!--split-->