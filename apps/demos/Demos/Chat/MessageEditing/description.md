The Chat component allows users to edit and delete sent messages.

Use a [data source](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource) if you want users to edit and delete messages. Implement custom insert, update, and delete operations. Once you configured these operations, enable [editing](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/).
<!--split-->

The **editing** object includes [allowUpdating](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/#allowUpdating) and [allowDeleting](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/#allowDeleting) properties. These Boolean options are initially `false`. You can set them to `true` or use functions with custom logic. When options are `true`, users can edit/delete their own messages.

In this demo, try deleting or editing messages. First, check that the options are active in the panel next to the Chat component. Right-click or long-tap a message to access the "Edit" and "Delete" commands in the context menu. Edit a message in the input field and click "Send" to save changes. 