The DevExtreme JavaScript FileManager component allows you to display and manage files and directories for different file systems. The FileManager uses file system providers to access file systems.
<!--split-->

Use the [fileSystemProvider](/Documentation/ApiReference/UI_Components/dxFileManager/Configuration/#fileSystemProvider) property to configure the component's file system provider. The ["File System Types"](/Demos/WidgetsGallery/Demo/FileManager/BindingToFileSystem/NetCore/Light) demo group illustrates how to use the FileManager with different file system providers.

The component's default security settings provide read-only access to files and directories. Use the [permissions](/Documentation/ApiReference/UI_Components/dxFileManager/Configuration/permissions) property to deny or allow a user to copy, create, move, delete, rename, upload, and download files and directories. You can also specify file restrictions: allowed file extensions ([allowedFileExtensions](/Documentation/ApiReference/UI_Components/dxFileManager/Configuration/#allowedFileExtensions)), chunk size ([chunkSize](/Documentation/ApiReference/UI_Components/dxFileManager/Configuration/upload/#chunkSize)) and maximum file size ([maxFileSize](/Documentation/ApiReference/UI_Components/dxFileManager/Configuration/upload/#maxFileSize)).

Use the component's [itemView](/Documentation/ApiReference/UI_Components/dxFileManager/Configuration/itemView/) property or the view switcher on the toolbar to display file system items as a detailed list or customizable thumbnails.

This demo contains commented out code lines that enable file modification operations. You can uncomment them and configure if necessary.