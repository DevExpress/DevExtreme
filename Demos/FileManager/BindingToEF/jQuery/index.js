$(function () {
    var provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
        endpointUrl: "https://js.devexpress.com/Demos/Mvc/api/file-manager-db"
    });

    $("#file-manager").dxFileManager({
        name: "fileManager",
        currentPath: "Documents/Reports",
        fileSystemProvider: provider,
        permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true
        },
        itemView: {
            details: {
                columns: [
                    "thumbnail", "name",
                    {
                        dataField: "dateModified",
                        caption: "Modified"
                    },
                    {
                        dataField: "created",
                        caption: "Created",
                        dataType: "date"
                    },
                    {
                        dataField: "modifiedBy",
                        caption: "Modified By",
                        visibleIndex: 2
                    }
                ]
            }
        },
        allowedFileExtensions: [],
        height: 550
    });
});