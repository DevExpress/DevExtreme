Our DataGrid component manages its edit state automatically. If your use case requires full control over the editing process, you can use the API members below to manage state manually. In this demo, we manage state with a help of the <a href="https://angular.io/guide/rx-library" target="_blank">RxJS</a> library.
<!--split-->

**Component Properties**

- **editing**.[editRowKey](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#editRowKey)        
The key for the row being edited.

- **editing**.[editColumnName](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#editColumnName)        
The name or data field of the column being edited.

- **editing**.[changes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#changes)       
Pending row changes.

Use these properties to access and change edit state. Two-way bind them to component properties so that you can get and set the properties at runtime. In this demo, we bind the **editRowKey** and **changes** properties to display their values under the DataGrid.

**Utility Method**

- [DevExpress.data.applyChanges(data, changes, options)](/Documentation/ApiReference/Data_Layer/Utils/#applyChangesdata_changes_options)      
Applies an array of changes to a source data array.

**Event Handlers**

- [onSaving](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSaving) / [onSaved](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSaved)        
Functions that are called before / after pending row changes are saved via the UI or programmatically.

- [onEditCanceling](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onEditCanceling) / [onEditCanceled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onEditCanceled)      
Functions that are called before / after editing is canceled and pending row changes are discarded.

Use these functions to perform custom actions. In this demo, the **onSaving** function sends pending changes to a server. The function's parameter `e` contains fields for this capability. To implement the same in your application, follow these steps:

1. **Disable built-in edit state management**       
Set the `e.cancel` field to **true**.

1. **Send a request to the server**      
Pending changes are stored in the `e.changes` array. This array has only a single element in all [edit modes](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#mode), except for batch. Check if this element is not empty and send it to the server (see the `processSaving` method in `app.component.ts` and the `saveChange` method in `app.service.ts`).

1. **Apply the same changes to the DataGrid's data source**       
If the server successfully saves changes, call the **applyChanges** method to save the same changes in the DataGrid's data source (see the `updateOrders` method in `app.service.ts`).

1. **Reset edit state**         
Assign **null** to the **editRowKey** and an empty array to the **changes** property (see the `processSaving` method in `app.component.ts`).