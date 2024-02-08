Users can modify TreeList data cell by cell. In this mode, only one cell can be in the edit state at a time. The TreeList saves changes immediately after the focus leaves cell.

To enable cell mode, do the following:
- Set the **editing**.[mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#mode) property to *"cell*".
- Assign **true** to the [editing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/) object's [allowUpdating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowUpdating), [allowAdding](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowDeleting) properties.

This demo also shows how to populate cells of a new row with default values. The values are assigned within the [onInitNewRow](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onInitNewRow) event handler.
