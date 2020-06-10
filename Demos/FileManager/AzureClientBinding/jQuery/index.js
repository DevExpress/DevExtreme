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

    var endpointUrl = "https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access";
    gateway = new AzureGateway(endpointUrl, onRequestExecuted);
    azure = new AzureFileSystem(gateway);

    var provider = new DevExpress.fileManagement.CustomFileSystemProvider({
        getItems: getItems,
        createDirectory: createDirectory,
        renameItem: renameItem,
        deleteItem: deleteItem,
        copyItem: copyItem,
        moveItem: moveItem,
        uploadFileChunk: uploadFileChunk,
        downloadItems: downloadItems
    });

    $("#file-manager").dxFileManager({
        fileSystemProvider: provider,
        allowedFileExtensions: [],
        upload: {
            maxFileSize: 1048576
        },
        permissions: {
            download: true
            // uncomment the code below to enable file/directory management
            /* create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true */
        }
    });
});

function getItems(parentDirectory) {
    return azure.getItems(parentDirectory.path);
}

function createDirectory(parentDirectory, name) {
    return azure.createDirectory(parentDirectory.path, name);
}

function renameItem(item, name) {
    return item.isDirectory ? azure.renameDirectory(item.path, name) : azure.renameFile(item.path, name);
}

function deleteItem(item) {
    return item.isDirectory ? azure.deleteDirectory(item.path) : azure.deleteFile(item.path);
}

function copyItem(item, destinationDirectory) {
    var destinationPath = destinationDirectory.path ? destinationDirectory.path + "/" + item.name : item.name;
    return item.isDirectory ? azure.copyDirectory(item.path, destinationPath) : azure.copyFile(item.path, destinationPath);
}

function moveItem(item, destinationDirectory) {
    var destinationPath = destinationDirectory.path ? destinationDirectory.path + "/" + item.name : item.name;
    return item.isDirectory ? azure.moveDirectory(item.path, destinationPath) : azure.moveFile(item.path, destinationPath);
}

function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
    var deferred = null;

    if(uploadInfo.chunkIndex === 0) {
        var filePath = destinationDirectory.path ? destinationDirectory.path + "/" + fileData.name : fileData.name;
        deferred = gateway.getUploadAccessUrl(filePath).done(function(accessUrl) {
            uploadInfo.customData.accessUrl = accessUrl;
        });
    } else {
        deferred = $.Deferred().resolve().promise();
    }

    deferred = deferred.then(function() {
        return gateway.putBlock(uploadInfo.customData.accessUrl, uploadInfo.chunkIndex, uploadInfo.chunkBlob);
    });

    if(uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
        deferred = deferred.then(function() {
            return gateway.putBlockList(uploadInfo.customData.accessUrl, uploadInfo.chunkCount);
        });
    }

    return deferred.promise();
}

function downloadItems(items) {
    azure.downloadFile(items[0].path);
}

function onRequestExecuted(e) {
    $("<div>").addClass("request-info").append(
            createParameterInfoDiv("Method:", e.method),
            createParameterInfoDiv("Url path:", e.urlPath),
            createParameterInfoDiv("Query string:", e.queryString),
            $("<br>")
        )
        .prependTo("#request-panel");
}

function createParameterInfoDiv(name, value) {
    return $("<div>").addClass("parameter-info").append(
        $("<div>").addClass("parameter-name").text(name),
        $("<div>").addClass("parameter-value dx-theme-accent-as-text-color").text(value).attr("title", value)
    );
}

var gateway = null;
var azure = null;