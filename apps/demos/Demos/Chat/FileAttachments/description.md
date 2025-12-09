DevExtreme Chat supports file attachments. When this feature is activated ([fileUploaderOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#fileUploaderOptions).**uploadFile** is `true`), an “Attach” button appears in the message input field, allowing users to add files to their messages. 

When users attach files, each file is displayed in the input area with a file-type icon, basic details (name and size), upload status, and an option to remove files before sending.
<!--split-->

You can further customize the file upload process with [fileUploaderOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#fileUploaderOptions) properties:

- **maxFileSize**    
Specify the maximum allowed file size.
- **minFileSize**    
Specify the minimum allowed file size.
- **multiple**    
Set to `false` to limit uploads to a single file.
- **allowedFileExtensions**    
Restrict accepted file types.

For the complete list of configuration options, refer to the following API section: [fileUploaderOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#fileUploaderOptions).

The [Attachment](/Documentation/ApiReference/UI_Components/dxChat/Types/Attachment/) type includes `name` and `size` fields. To add custom fields (such as `url` in this demo), handle the [onMessageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event and update the message object’s [attachments](/Documentation/ApiReference/UI_Components/dxChat/Types/TextMessage/#attachments) array as needed. You can use this handler to save files to your server.

After a user sends a message, attachments appear in the corresponding message bubble. To allow users to download attachments, implement the [onAttachmentDownloadClick](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onAttachmentDownloadClick) event handler. You can define custom download logic within the handler.
