$(function(){
    $("#file-uploader").dxFileUploader({
        dialogTrigger: "#dropzone-external",
        dropZone: "#dropzone-external",
        multiple: false,
        allowedFileExtensions: [".jpg", ".jpeg", ".gif", ".png"],
        uploadMode: "instantly",
        uploadUrl: "https://js.devexpress.com/Content/Services/upload.aspx",
        visible: false,
        onDropZoneEnter: function(e) {
            if(e.dropZoneElement.id === "dropzone-external")
                toggleDropZoneActive(e.dropZoneElement, true);
        },
        onDropZoneLeave: function(e) {
            if(e.dropZoneElement.id === "dropzone-external")
                toggleDropZoneActive(e.dropZoneElement, false);
        },
        onUploaded: function(e) {
            const file = e.file;
            const dropZoneText = document.getElementById("dropzone-text");
            const fileReader = new FileReader();
            fileReader.onload = function() {
                toggleDropZoneActive(document.getElementById("dropzone-external"), false);
                const dropZoneImage = document.getElementById("dropzone-image");
                dropZoneImage.src = fileReader.result;
            }
            fileReader.readAsDataURL(file);
            dropZoneText.style.display = "none";
            uploadProgressBar.option({
                visible: false,
                value: 0
            });
        },
        onProgress: function(e) {
            uploadProgressBar.option("value", e.bytesLoaded / e.bytesTotal * 100)

        },
        onUploadStarted: function() {
            toggleImageVisible(false);
            uploadProgressBar.option("visible", true);
        }
    });

    var uploadProgressBar = $("#upload-progress").dxProgressBar({
        min: 0,
        max: 100,
        width: "30%",
        showStatus: false,
        visible: false
    }).dxProgressBar("instance");

    function toggleDropZoneActive(dropZone, isActive) {
        if(isActive) {
            dropZone.classList.add("dx-theme-accent-as-border-color");
            dropZone.classList.remove("dx-theme-border-color");
            dropZone.classList.add("dropzone-active");
        } else {
            dropZone.classList.remove("dx-theme-accent-as-border-color");
            dropZone.classList.add("dx-theme-border-color");
            dropZone.classList.remove("dropzone-active");
        }
    }

    function toggleImageVisible(visible) {
        const dropZoneImage = document.getElementById("dropzone-image");
        dropZoneImage.hidden = !visible;
    }

    document.getElementById("dropzone-image").onload = function() { toggleImageVisible(true); };
});