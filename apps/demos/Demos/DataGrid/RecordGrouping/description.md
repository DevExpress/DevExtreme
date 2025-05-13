DataGrid allows users to group data by columns with the group panel. To display the group panel area, assign `true` to [groupPanel](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/groupPanel/).[visible](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/groupPanel/#visible).
<!--split-->

To group data, users can drag and drop column headers between the column headers area and the group panel. DataGrid also supports keyboard shortcuts to perform grouping actions:

- Ctrl+G:    
Group the focused column header from the column headers area.
- Backspace, Delete, and Ctrl+Shift+G:    
Ungroup the focused column header from the group panel or the column headers area. Users can ungroup from the column headers area only when the focused item's [showWhenGrouped](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#showWhenGrouped) is set to `true`.
- Shift+Alt+G:    
Ungroup all grouped items from the group panel.

To allow users to reorder headers within the group panel, assign `true` to the [allowColumnReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnReordering) property. Reordering headers in the group panel will change the component's group hierarchy. Users can reorder headers with mouse drag-and-drop operations or with keyboard shortcuts:

- Ctrl+Left Arrow    
Reorder the focused header to the left.
- Ctrl+Right Arrow    
Reorder the focused header to the right.

Grouping and reordering operations are also available in the component's context menu.

To group data against a single **column**, apply the [groupIndex](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#groupIndex) property to it. This property accepts a zero-based index number that controls the column order. In this example, the data is grouped against the *State* column.

You can also use the [grouping](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/grouping/) object to specify user interaction settings related to grouping. This demo illustrates the [autoExpandAll](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/grouping/#autoExpandAll) property that specifies whether the groups appear expanded.