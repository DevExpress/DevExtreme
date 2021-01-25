This demo shows how to use drag and drop to reorder records stored on the server. This functionality requires that records' order indexes are in an individual data field (`OrderIndex` in this demo) and sorted against that field.

Row drag and drop is configured in the [rowDragging][5] object. Set [allowReordering][2] to **true** to enable this feature. When a row is dropped, the [onReorder][0] event handler is called. Use it to update the record's `OrderIndex` on the server.

In this demo, we use the **onReorder** function's `toIndex` parameter to obtain the position at which a user dropped the row. The position is then used to get the new order index. The store's [update][1] method sends this index to the server where the records are sorted and returned to the client. Server-side implementation is available in the [ASP.NET Core][3] and [ASP.NET MVC 5][4] versions of this demo under the `DataGridRowReorderingController.cs` tab.

[0]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#onReorder
[1]: /Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#update
[2]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#allowReordering
[3]: /Demos/WidgetsGallery/Demo/DataGrid/RemoteReordering/NetCore/Light/
[4]: /Demos/WidgetsGallery/Demo/DataGrid/RemoteReordering/Mvc/Light/
[5]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/