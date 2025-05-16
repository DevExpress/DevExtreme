To group data by columns, users can utilize the group panel. Enable the [groupPanel](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/groupPanel/).[visible](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/groupPanel/#visible) property to display the group panel area.
<!--split-->

To group data, users can drag and drop column headers onto and from the group panel. DataGrid also supports keyboard shortcuts to perform grouping actions:

- **Ctrl+G**    
Move the focused column header to the group panel. 
- **Backspace**, **Delete**, and **Ctrl+Shift+G**    
Remove the focused column header from the group panel. This shortcut is available for items in:
    - The group panel.
    - The column header if [showWhenGrouped](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#showWhenGrouped) is enabled.
- **Shift+Alt+G**    
Ungroup all items from the group panel.

To allow users to reorder headers within the group panel, assign `true` to the [allowColumnReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnReordering) property. Reordering headers in the group panel changes the component's group hierarchy. Users can reorder headers with mouse drag-and-drop operations or keyboard shortcuts:

- **Ctrl/Cmd+Left Arrow**    
Move the focused header to the left.
- **Ctrl/Cmd+Right Arrow**    
Move the focused header to the right.

Grouping and reordering operations are also available in the component's context menu.

To group data against a single **column**, apply the [groupIndex](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#groupIndex) property to it. This property accepts a zero-based index number that controls the column order. In this example, the data is grouped against the *State* column.

You can also use the [grouping](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/grouping/) object to specify user interaction settings related to grouping. This demo illustrates the [autoExpandAll](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/grouping/#autoExpandAll) property that specifies whether the groups appear expanded.
