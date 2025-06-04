The Chat component allows to edit and delete messages sent by the current user.

Use a [data source](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource) if you want users to edit and delete messages. Implement [custom CRUD operations](/Documentation/ApiReference/Data_Layer/CustomStore/). Once you configured these operations, enable [editing](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/).
<!--split-->

[note] Chat does not update the data source automatically. Implement a [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) with CRUD operations to handle updates.

The **editing** object includes [allowUpdating](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/#allowUpdating) and [allowDeleting](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/#allowDeleting) properties. These Boolean options are set to `false` initially. To allow your users to edit and delete their own messages, set these Boolean options to `true` or use functions with custom logic. 

In this demo, try deleting or editing messages. First, check that the options are active in the panel next to the Chat component. Right-click (Control+Click on MacOS) or long-tap a message to open the context menu. Select "Delete" to remove the message, which then shows a marker in the feed. Choose "Edit" to view the original message and update its content. Click "Send" to save changes, and the message is marked as edited.