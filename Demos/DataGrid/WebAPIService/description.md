To access a Web API service from the client, use the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data/blob/master/docs/client-side-with-jquery.md#api-reference" target="_blank">createStore</a> method which is part of the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data#devextreme-aspnet-data" target="_blank">DevExtreme.AspNet.Data</a> extension. This extension also allows you to process data for DevExtreme components <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data/blob/master/docs/server-side-configuration.md" target="_blank">on the server</a>. The server-side implementation is available under the `DataGridWebApiController.cs` tab in the [ASP.NET MVC version of this demo](/Demos/WidgetsGallery/Demo/DataGrid/WebAPIService/Mvc/Light/).
 
To notify the DataGrid that data is processed on the server, set the [remoteOperations](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/remoteOperations/) property to **true**.

[note]

If you target .NET for your backend API, be sure to check out <a href="https://docs.devexpress.com/eXpressAppFramework/403394/backend-web-api-service?utm_source=js.devexpress.com&utm_medium=referral&utm_campaign=xaf&utm_content=grid-demo-web-api" target="_blank">Web API Service</a> and register your <a href="https://www.devexpress.com/security-api-free?utm_source=js.devexpress.com&utm_medium=referral&utm_campaign=xaf&utm_content=grid-demo-web-api" target="_blank">free copy today</a>. The Solution Wizard scaffolds an OData v4 Web API Service (.NET 6+) with integrated authorization & CRUD operations powered by EF Core and our XPO ORM library. You can use OAuth2, JWT or custom authentication strategies alongside tools like Postman or Swagger (OpenAPI) for API testing.

The built-in Web API Service also filters out secured server data based on permissions granted to users. Advanced/enterprise functions include audit trail, endpoints to download reports, file attachments, check validation, obtain localized captions, etc. 

To use the free Solution Wizard (which creates the Web API Service) run the Universal Component Installer from the <a href="https://www.devexpress.com/ClientCenter/DownloadManager/?utm_source=js.devexpress.com&utm_medium=referral&utm_campaign=xaf&utm_content=grid-demo-web-api" target="_blank">DevExpress Download Manager</a>.

[/note]