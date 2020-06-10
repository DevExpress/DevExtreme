$(function () {
    var provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
        endpointUrl: "https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-scripts"
    });

    $("#file-manager").dxFileManager({
        name: "fileManager",
        fileSystemProvider: provider,
        permissions: {
            download: true
            // uncomment the code below to enable file/directory management
            /* create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true */
        },
        allowedFileExtensions: [".js", ".json", ".css"]
    });
});