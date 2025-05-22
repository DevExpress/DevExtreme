Chat allows editing and deleting sent messages.

Use a [data source](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#dataSource) if you want to enable message editing and deleting. Implement custom insert, update, and delete operations. Once configured, enable [editing](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/).
<!--split-->

The **editing** object includes [allowUpdating](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/#allowUpdating) and [allowDeleting](/Documentation/ApiReference/UI_Components/dxChat/Configuration/editing/#allowDeleting) properties. These Boolean options are Initially `false` but can be functions for custom logic. If you set them to `true`, users can edit/delete their own messages.

In this demo, toggle these settings to test functionality. Right-click or long tap a message to access "Edit" and "Delete" commands in the context menu. Edit messages in the input field and click "Send" to save changes. 