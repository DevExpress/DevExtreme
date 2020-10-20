If **editing**.[mode](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/editing/#mode) is *"batch"*, users can modify multiple records and submit all changes simultaneously. If data is stored on a server, the **DataGrid** component sends multiple requests to save edited objects - one request per object. This is because most servers process only one edit operation at a time. However, if your server supports batch update, you can configure the **DataGrid** to save all changes with a single request.

To add this functionality, implement the [onSaving](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onSaving) function. It accepts an `e` object that contains fields used for batch update. The following steps describe the function's implementation:

1. **Disable the default saving logic**                       
Set the `e.cancel` field to `true`.

2. **Send pending changes to the server**              
Pending changes are contained in the `e.changes` array. Ensure it is not empty and send the changes to the server.

3. **Update data in the widget**            
Once the changes are saved, call the [refresh(changesOnly)](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#refreshchangesOnly) method.

4. **Reset the edit state**           
Use the [cancelEditData()](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Methods/#cancelEditData) method to clear the pending changes.
