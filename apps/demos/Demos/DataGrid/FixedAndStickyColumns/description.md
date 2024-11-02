A horizontal scrollbar appears when the total width of all columns exceeds the DataGrid component's width. The component allows users to fix individual columns at the right or left border so that they are always visible. Users can also set sticky columns so that they initially remain static but start scrolling when they reach their position. Once scrolling moves past this point, they reattach to a different side of the table.

To enable this feature, set the **columnFixing**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnFixing/#enabled) property to `true`.
<!--split-->

To fix or unfix a column, users should right-click the column's header and select the corresponding operation in the context menu. To prevent users from fixing or unfixing a column, set its [allowFixing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowFixing) property to `false`.

To fix a column programmatically, set its [fixed](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixed) property to `true`. The default position is the DataGrid's left, but you can set the column's [fixedPosition](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixedPosition) property to *"right"* or *"sticky"*.