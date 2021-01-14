Users can modify **DataGrid** data cell by cell. In this mode, only one cell can be in the edit state at a time. **DataGrid** saves changes immediately after the focus leaves cell.

To enable the cell mode, do the following:
- Set the **editing**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#mode) to *"cell*".
- Assign **true** to the [editing](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/) object's [allowUpdating](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#allowUpdating), [allowAdding](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#allowDeleting) properties.

This demo also shows how to delete selected records. Review the [onSelectionChanged](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onSelectionChanged) and `deleteRecords` functions for implementation details.