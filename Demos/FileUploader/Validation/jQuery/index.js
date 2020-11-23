$(function () {
    $("#file-uploader-images").dxFileUploader({
        multiple: true,
        uploadMode: "useButtons",
        uploadUrl: "https://js.devexpress.com/Demos/NetCore/FileUploader/Upload",
        allowedFileExtensions: [".jpg", ".jpeg", ".gif", ".png"]
    });
    $("#file-uploader-max-size").dxFileUploader({
        multiple: true,
        uploadMode: "useButtons",
        uploadUrl: "https://js.devexpress.com/Demos/NetCore/FileUploader/Upload",
        maxFileSize: 4000000
    });
});