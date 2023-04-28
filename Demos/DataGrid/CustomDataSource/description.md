DevExtreme provides the [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) component to load and edit data from a custom data source. In this demo, the **CustomStore** fetches data from a custom remote server and displays it in the DataGrid.

The communication between the **CustomStore** and the server is organized as follows:
 
- The **CustomStore** sends [data processing settings](/Documentation/ApiReference/Data_Layer/CustomStore/LoadOptions/) to the server (see the **load** function in the code below).
- The server applies these settings to data and returns the processed dataset (you should write the server-side code for this).

Each setting has information about a data operation (sorting, filtering, etc.) and is present only if this operation is declared as remote in the DataGrid's [remoteOperations](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/) property. If your server does not support a certain operation, do not declare it as remote to perform it on the client.

For more information about the communication between the client and server in DevExtreme, refer to the following help topic: [Server-Side Data Processing](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/#Load_Data/Server-Side_Data_Processing).

If your server does not support any data operations, set **remoteOperations** to **false** and implement the **load** function as described in the following help topic: [Client-Side Data Processing](/Documentation/Guide/Data_Binding/Specify_a_Data_Source/Custom_Data_Sources/#Load_Data/Client-Side_Data_Processing).

### A 1-Click Solution for CRUD Web API Services with Role-based Access Control via EF Core & XPO

If you target .NET for your backend API, be sure to check out <a href="https://docs.devexpress.com/eXpressAppFramework/403394/backend-web-api-service?utm_source=js.devexpress.com&utm_medium=referral&utm_campaign=xaf&utm_content=grid-demo-custom-source" target="_blank">Web API Service</a> and register your <a href="https://www.devexpress.com/security-api-free?utm_source=js.devexpress.com&utm_medium=referral&utm_campaign=xaf&utm_content=grid-demo-custom-source" target="_blank">free copy today</a>. The Solution Wizard scaffolds an OData v4 Web API Service (.NET 6+) with integrated authorization & CRUD operations powered by EF Core and our XPO ORM library. You can use OAuth2, JWT or custom authentication strategies alongside tools like Postman or Swagger (OpenAPI) for API testing.

The built-in Web API Service also filters out secured server data based on permissions granted to users. Advanced/enterprise functions include audit trail, endpoints to download reports, file attachments, check validation, obtain localized captions, etc. 

To use the free Solution Wizard (which creates the Web API Service) run the Universal Component Installer from the <a href="https://www.devexpress.com/ClientCenter/DownloadManager/?utm_source=js.devexpress.com&utm_medium=referral&utm_campaign=xaf&utm_content=grid-demo-custom-source" target="_blank">DevExpress Download Manager</a>.