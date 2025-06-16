This demo sets **selection**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#mode) to *"multiple"*. This allows users to select multiple rows using checkboxes or keyboard shortcuts.

To configure when the checkboxes appear, set the [showCheckBoxesMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#showCheckBoxesMode) property.

The checkbox in the header selects all rows or current page rows, depending on the [selectAllMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#selectAllMode) value. If you want to disable this checkbox, set [allowSelectAll](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#allowSelectAll) to **false**.

In this demo, you can use the drop-down menus under the grid to change the **showCheckBoxesMode** and **selectAllMode** values.
<!--split-->

If **showCheckBoxesMode** is *"always"*, you can select and unselect a row by clicking its checkbox. Focus the component's data cells with the arrow keys, **Tab**, **Shift+Tab**, **Home**, and **End**, and press **Space** to select or unselect a row.

If **showCheckBoxesMode** is *"none"*, *"onCLick"*, or *"onLongTap"*, you can click a row or focus a data cell and press **Space** to select a row. Unselect a row or select one without clearing previous selection with **Ctrl+Click**/**Ctrl+Space**.

Use **Shift+Click**/**Shift+Space** to select all items between two rows. For more details, refer to the DataGrid [Keyboard Navigation](/Documentation/Guide/UI_Components/DataGrid/Accessibility/#Keyboard_Navigation) help topic.