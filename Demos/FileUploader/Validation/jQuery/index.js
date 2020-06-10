$(function () {
    $("#file-uploader-images").dxFileUploader({
        multiple: true,
        uploadMode: "useButtons",
        uploadUrl: "https://js.devexpress.com/Content/Services/upload.aspx",
        allowedFileExtensions: [".jpg", ".jpeg", ".gif", ".png"]
    });
    $("#file-uploader-max-size").dxFileUploader({
        multiple: true,
        uploadMode: "useButtons",
        uploadUrl: "https://js.devexpress.com/Content/Services/upload.aspx",
        maxFileSize: 4000000
    });
});