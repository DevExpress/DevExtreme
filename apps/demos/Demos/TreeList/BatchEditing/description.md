You can use batch edit mode to defer saving multiple cell changes. Changes are stored in a buffer and can be discarded before a user clicks the **Save** button.

To enable batch edit mode, configure the following properties:

* Set **editing**.[mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#mode) to *"batch"*.
* Assign **true**  to the [editing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#mode) object's [allowUpdating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowUpdating), [allowAdding](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowDeleting) properties.

This demo also shows how to populate cells of a new row with default values. The values are assigned within the [onInitNewRow](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onInitNewRow) event handler.

If data is stored on a server, the TreeList sends multiple requests to save edited objects - one request per object (this is because most servers only process one edit operation at a time). If your server supports batch update, you can configure the TreeList to save all changes with a single request. Refer to the following demo for more information: [DataGrid: Batch Update Request](https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/BatchUpdateRequest/).
