With the DevExtreme DataGrid, users can modify multiple records and submit all changes simultaneously (when **editing**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#mode) is set to *"batch"*). Batch editing allows you to optimize your app, address performance related issues, and deliver the best possible user experience across a variety of usage scenarios. 

If data is stored on a server, our DataGrid sends multiple requests to save edited objects - one request per object (this is because most servers only process one edit operation at a time). If your server supports batch update, you can configure the DataGrid to save all changes with a single request.

To incorporate this functionality into your web app, implement the DataGrid's [onSaving](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSaving) function. This function accepts an `e` object that contains fields used for batch update. The following is a summary of the steps you must follow to enable batch update:

1. **Disable default save logic**                       
Set the `e.cancel` field to `true`.

2. **Send pending changes to the server**              
Pending changes are contained in the `e.changes` array. Ensure it is not empty and send the changes to the server.

3. **Update data in the DataGrid**            
Once changes are saved, call the [refresh(changesOnly)](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#refreshchangesOnly) method.

4. **Reset edit state**           
Use the [cancelEditData()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#cancelEditData) method to clear pending changes.
