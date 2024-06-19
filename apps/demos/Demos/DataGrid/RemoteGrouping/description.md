Remote (server-side) operations can boost the DataGrid's performance on large datasets. In this demo, the DataGrid works with a million records seamlessly because they are processed on the server.
<!--split-->

To notify the DataGrid that it works with a pre-processed dataset, set the [remoteOperations](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/) property to **true**.

You can also specify properties that allow the DataGrid to load data on demand to reduce the amount of transmitted data. Set the **grouping**.[autoExpandAll](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/grouping/#autoExpandAll) property to **false** to collapse all the groups at startup. Data for each group is loaded only when the user expands the group. Enable the *"virtual"* **scrolling**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/scrolling/#mode) to load only those records that come into the viewport when the grid is scrolled vertically.

The DataGrid communicates with the server according to a protocol. Refer to the [Server-Side Data Processing](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/#Load_Data/Server-Side_Data_Processing) article for information on it.

[note] The data source in this demo is configured to return only 1000 records per request.