The DataGrid allows users to edit data in multiple modes. This demo shows the *"row"* edit mode. To start editing any row, click *"Edit"* in it. Only one row can be in the edit state at a time.

To enable row edit mode, set the [mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#mode) property to "row" and assign true to the editing object's [allowUpdating](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowUpdating), [allowAdding](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowDeleting) properties.

Edit operations raise events that you can handle with the following functions:    
- [onEditingStart](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onEditingStart)
- [onInitNewRow](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onInitNewRow)
- [onRowInserting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowInserting) / [onRowInserted](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowInserted)
- [onRowUpdating](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowUpdating) / [onRowUpdated](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowUpdated)
- [onRowRemoving](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowRemoving) / [onRowRemoved](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onRowRemoved)
- [onSaving](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSaving) / [onSaved](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSaved)
- [onEditCanceling](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onEditCanceling) / [onEditCanceled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onEditCanceled)
 
This demo shows an event log under the grid.