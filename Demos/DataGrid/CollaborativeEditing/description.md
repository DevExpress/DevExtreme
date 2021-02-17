Multiple users can edit the DataGrid's data in real-time. In this demo, changes made in one UI component are broadcasted to the other UI component via the <a href="https://dotnet.microsoft.com/apps/aspnet/signalr" target="blank">SignalR</a> service.

To implement this functionality:

1. Generate a session ID used to identify UI components that should be edited simultaneously (`groupId` in this demo).
1. Configure **CustomStore**s. In this demo, we use the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data/blob/master/docs/client-side-with-jquery.md#api-reference" target="_blank">createStore</a> method (part of the <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data" target="_blank">DevExtreme.AspNet.data</a> extension). The <a href="https://github.com/DevExpress/DevExtreme.AspNet.Data/blob/master/docs/client-side-with-jquery.md#api-reference" target="blank">onBeforeSend</a> function is used to send the session ID from step 1 to the server.
1. Create store instances — one per UI component.
1. Create UI components and bind them to the store instances.
1. Update all the store instances when a push notification is received (see the `updateStores` function).

Changes made collaboratively are lost if you refresh the page because the **SignalR** service broadcasts changes without saving them.