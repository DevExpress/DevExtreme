DevExtreme Chat supports file attachments. To enable this feature, specify [fileUploaderOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#fileUploaderOptions).**fileUpload** - an "Attach" button appears in the input field, and users can send messages with files.

You can configure other file uploader settings in the [fileUploaderOptions](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#fileUploaderOptions) object. For all available settings, refer to the [fileUploaderOptions API section](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#fileUploaderOptions).
<!--split-->

Attachments use the [Attachment](/Documentation/ApiReference/UI_Components/dxChat/Types/Attachment/) type with "name" and "size" fields. To include another field (this demo adds "url"), handle the [onMessageEntered](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onMessageEntered) event and update the data source with the [attachments](/Documentation/ApiReference/UI_Components/dxChat/Types/TextMessage/#attachments) field.

To enable attachment download, handle the [onAttachmentDownloadClick](/Documentation/ApiReference/UI_Components/dxChat/Configuration/#onAttachmentDownloadClick) event. When you specify this handler, Chat displays a "Download" button next to each attachment. Implement custom download logic as needed.