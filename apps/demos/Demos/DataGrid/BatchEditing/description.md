You can use batch edit mode to defer saving multiple cell changes. Changes are stored in a buffer and can be discarded before a user clicks the **Save** button.

To enable batch edit mode, configure the following properties:

* Set **editing**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#mode) to *"batch"*.
* Assign **true**  to the [editing](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#mode) object's [allowUpdating](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowUpdating), [allowAdding](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowDeleting) properties.

The [startEditAction](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#startEditAction) property specifies whether cells enter the editing state on a single or double click. Cell edit also selects the cells' text because the [selectTextOnEditStart](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#selectTextOnEditStart) property is set to **true**. You can use the controls below the DataGrid to change these properties at runtime.
