DevExtreme provides the [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) UI component to load and edit data from a custom data source. In this demo, the **CustomStore** fetches data from a custom remote server and displays it in the **DataGrid**.

The communication between the **CustomStore** and the server is organized as follows:
 
- The **CustomStore** sends [data processing settings](/Documentation/ApiReference/Data_Layer/CustomStore/LoadOptions/) to the server (see the **load** function in the code below).
- The server applies these settings to data and returns the processed dataset (you should write the server-side code for this).

Each setting has information about a data operation (sorting, filtering, etc.) and is present only if this operation is declared as remote in the **DataGrid**'s [remoteOperations](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/) property. If your server does not support a certain operation, do not declare it as remote to perform it on the client.

For more information about the communication between the client and server in DevExtreme, refer to the following help topic: [Server-Side Data Processing](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/#Load_Data/Server-Side_Data_Processing).

If your server does not support any data operations, set **remoteOperations** to **false** and implement the **load** function as described in the following help topic: [Client-Side Data Processing](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/#Load_Data/Client-Side_Data_Processing).