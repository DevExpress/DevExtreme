This functionality requires that data objects have a data field that identifies which grid they belong to. In this demo, this data field is `Status`.

To allow users to move rows between grids, follow these steps:

1. **Bind the grids to the same store**         
The store should be able to update data. In this demo, the store is created using the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data/blob/master/docs/client-side-with-jquery.md#api-reference" target="_blank">createStore</a> method (part of the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data#devextreme-aspnet-data" target="_blank">DevExtreme.AspNet.Data</a> extension). The specified `updateUrl` enables the store to update data.

1. **Specify grid identifiers**         
Save them in the [rowDragging][0].[data][1] property. The grids below have identifiers 1 and 2.

1. **Filter the grids to display different record sets**        
Use the identifiers in the [filterValue][2] property to filter the grids. The grids below display only the records whose `Status` field equals the grid's identifier.

1. **Join the grids into one drag and drop group**          
Set the **rowDragging**.[group][3] property to the same value for all grids to allow moving rows between them.

1. **Update the data field that specifies where the row belongs**         
Implement the **rowDragging**.[onAdd][4] function. To access the target grid's identifier, use the `toData` function parameter. Call the store's [update][5] method to send this identifier to the server and [push][6] the same changes to the store on the client. The grids are refreshed automatically if you enable [reshapeOnPush][7] in the [dataSource][8].

[0]: /Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/rowDragging/
[1]: /Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/rowDragging/#data
[2]: /Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#filterValue
[3]: /Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/rowDragging/#group
[4]: /Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/rowDragging/#onAdd
[5]: /Documentation/ApiReference/Data_Layer/CustomStore/Methods/#updatekey_values
[6]: /Documentation/ApiReference/Data_Layer/CustomStore/Methods/#pushchanges
[7]: /Documentation/ApiReference/Data_Layer/DataSource/Configuration/#reshapeOnPush
[8]: /Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#dataSource