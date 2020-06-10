$(function() {
    var loadPanel = $("#load-panel").dxLoadPanel({
        position: { of: "#file-manager" }
    }).dxLoadPanel("instance");

    $.ajax({
        url: "https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager",
        success: function(result) {
            var className = result.active ? "show-widget" : "show-message";
            $("#wrapper").addClass(className);
            loadPanel.hide();
        }
    });

    var provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
        endpointUrl: "https://js.devexpress.com/Demos/Mvc/api/file-manager-azure"
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
        allowedFileExtensions: []
    });
});