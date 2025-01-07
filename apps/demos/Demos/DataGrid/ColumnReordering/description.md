DevExtreme DataGrid columns use the same display order as fields in data objects. You can use the [columns](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/) array to specify a different display order. To reorder a column at runtime, change the **column**.[visibleIndex](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#visibleIndex) property.

Users can drag and drop column headers to reorder columns as needed. To activate this feature, set the [allowColumnReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#allowColumnReordering) property to **true**. If you wish to prevent reorder operations for a given column, disable its **column**.[allowReordering](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowReordering) property.
<!--split-->

This demo illustrates [fixed](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixed) column behavior during user-initiated column reorder operations. Users can drag & drop columns within the following areas (but not between them):

- Columns fixed to the left
- Non-fixed columns
- Columns fixed to the right

Sticky columns (fixed with the 'sticky' [position](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#fixedPosition)) behave like non-fixed columns during reorder operations (even if they are in a state where they are attached to a border/fixed column). To see sticky columns in this demo, right-click a column to open the DataGrid’s context menu. Choose "Set Fixed Position -> Sticky" to stick a given column.