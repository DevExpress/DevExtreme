A horizontal scrollbar appears when the total width of all grid columns exceeds the DevExtreme TreeList's overall width. To maintain column visibility when scrolling horizontally, set the **columnFixing**.[enabled](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columnFixing/#enabled) property to `true`.
<!--split-->

To fix a column programmatically, set its [fixed](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#fixed) property to `true` and specify the desired [fixedPosition](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#fixedPosition):

- *'left'* (default if `fixed: true`)    
The column is fixed to the leftmost edge of the grid.

- *'right'*    
The column is fixed to the rightmost edge of the grid.

- *'sticky'*    
The column "sticks" to the left or rightmost edge when it reaches either side of the grid.

To fix (or unfix) a column, right-click a column header and select the desired operation using the component's built-in context menu. To prevent users from fixing/unfixing columns, disable [columns[]](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/).[allowFixing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#allowFixing).

You can scroll the component's data horizontally with **Shift + Scroll Wheel**. Jump to the first/last cell of the focused row using **Home**/**End**. Focus the first cell of the first row/last cell of the last row with **Ctrl + Home**/**Ctrl + End**.