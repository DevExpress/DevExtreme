TreeList columns have the same order as fields in data objects. You can use the [columns](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/) array to specify a different order. To reorder a column at runtime, change **column**.[visibleIndex](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#visibleIndex) property.

Users can drag and drop column headers to reorder columns. To enable this feature, set the [allowColumnReordering](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#allowColumnReordering) property to **true**. If you do not want users to drag a specific column, disable  **column**.[allowReordering](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#allowReordering) property.
<!--split-->

This demo shows how [fixed](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#fixed) columns behave during user-initiated reordering. Users can drag and drop columns within the following areas (but not between them):

- Columns fixed to the left
- Non-fixed columns
- Columns fixed to the right

Sticky columns (fixed with the 'sticky' [position](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#fixedPosition)) behave like non-fixed columns during reordering (even if they are in a state where they are attached to a border/fixed column). To see sticky columns in this demo, right-click a column to open a context menu. Choose "Set Fixed Position -> Sticky" to stick a column.