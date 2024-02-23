The TreeList can load a remote dataset dynamically as a user expands nodes. The dataset must have a [plain structure](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#dataStructure).

This feature requires client- and server-side configurations. To configure the client-side part, do the following:

1. **Send an expanded node's ID to the server**       
For this, implement the CustomStore's [load](/Documentation/ApiReference/Data_Layer/CustomStore/Configuration/#load) function. In this demo, we do it in the [dataSource](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#dataSource) configuration object.

1. **Delegate filtering to the server**         
Set the **remoteOperations**.[filtering](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/remoteOperations/#filtering) property to **true**.

3. **Specify the data field that defines whether the node has children**           
Use the [hasItemsExpr](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#hasItemsExpr) property to set this data field.

Server-side implementation is available in the [ASP.NET Core](https://demos.devexpress.com/aspnetcore/Demo/TreeList/LoadDataOnDemand/) and [ASP.NET MVC](https://demos.devexpress.com/ASPNetMvc/Demo/TreeList/LoadDataOnDemand) versions of this demo under the `TreeListDataController.cs` tab.

[note]

This demo uses a simple data bind technique that is useful for data display purposes only. When a user clicks a node, TreeList receives a JSON object from the server, which is based on the parentIds property value. This technique does not support the built-in data process operations in TreeList on the server.

If your project needs to process data, do one of the following instead:

- Implement a custom data source. See the [Custom Data Source](https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/CustomDataSource/jQuery/Light/) demo.
- Use the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data#devextreme-aspnet-data" target="_blank">DevExtreme.AspNet.Data</a> extension as shown in the [Web API Service](https://js.devexpress.com/Demos/WidgetsGallery/Demo/TreeList/WebAPIService/) demo.

[/note]
