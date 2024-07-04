This demo shows how to use drag and drop to reorder records stored on the server. This functionality requires that records' order indexes are in an individual data field (`OrderIndex` in this demo) and sorted against that field.

Row drag and drop is configured in the [rowDragging][0] object. Set [allowReordering][1] to **true** to enable this feature. To specify the highlight mode of the row's drop position, use the [dropFeedbackMode][2] property. In this demo, it is set to *"push"*: rows move up or down with animation to create space for the new position of the row.

[0]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/
[1]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#allowReordering
[2]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#dropFeedbackMode
<!--split-->

When a row is dropped, the [onReorder][3] event handler is called. Use it to update the record's `OrderIndex` on the server. In this demo, we use the **onReorder** function's `toIndex` parameter to obtain the position at which a user dropped the row. The position is then used to get the new order index. The store's [update][4] method sends this index to the server where the records are sorted and returned to the client. Server-side implementation is available in the [ASP.NET Core][5] and [ASP.NET MVC 5][6] versions of this demo under the `DataGridRowReorderingController.cs` tab.

[3]: /Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#onReorder
[4]: /Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#update
[5]: https://demos.devexpress.com/ASPNetCore/Demo/DataGrid/RemoteReordering/
[6]: https://demos.devexpress.com/ASPNetMvc/Demo/DataGrid/RemoteReordering/
