This example demonstrates real-time data update in a **DataGrid** bound to a <a href="https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction" target="_blank">SignalR</a> service. Access to the service is configured in a [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/).
<!--split-->
 
The **CustomStore** fetches the remote dataset at launch and keeps its local copy. Whenever the remote dataset changes, the server calls a client-side function that updates the local copy of the dataset (`updateStockPrices` in this demo). This function uses the store's [push(changes)](/Documentation/ApiReference/Data_Layer/CustomStore/Methods/#pushchanges) method.

For server-side configuration, refer to the [ASP.NET MVC version of this demo](https://demos.devexpress.com/ASPNetMvc/Demo/DataGrid/SignalRService).

For more information about integration with push services, refer to the following help topic: [Integration with Push Services](/Documentation/Guide/Data_Binding/Data_Layer/#Data_Modification/Integration_with_Push_Services).
 
[note]Data used in this demo is for demonstration purposes only.