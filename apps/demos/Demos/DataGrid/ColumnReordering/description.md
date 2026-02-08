DevExtreme DataGrid columns use the same display order as fields in the component's [dataSource](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#dataSource). You can specify a different display order with the [columns[]](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/) array. To reorder a column at runtime, change the **columns[]**.[visibleIndex](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#visibleIndex) property.
<!--split-->

To allow users to reorder columns, set [allowColumnReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnReordering) to `true`. To disable reordering operations for a specific column, assign `false` to its [allowReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowReordering) property.

Users can reorder columns with mouse drag-and-drop operations or with keyboard shortcuts:

- **Ctrl/Cmd+Left Arrow**    
Move the focused column to the left.
- **Ctrl/Cmd+Right Arrow**    
Move the focused column to the right.

Reordering operations are also available in the component's context menu.

This demo illustrates [fixed](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixed) column behavior during user-initiated column reorder operations. Users can drag & drop columns within the following areas (but not between them):

- Columns fixed to the left
- Non-fixed columns
- Columns fixed to the right

Sticky columns (fixed with the 'sticky' [position](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixedPosition)) behave like non-fixed columns during reorder operations (even if they are in a state where they are attached to a border/fixed column). To see sticky columns in this demo, right-click a column to open the DataGrid’s context menu. Choose "Set Fixed Position -> Sticky" to stick a given column.
