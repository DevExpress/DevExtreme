$(function () {
    $("#file-manager").dxFileManager({
        name: "fileManager",
        fileSystemProvider: fileSystem,
        itemView: {
            mode: "thumbnails"
        },
        height: 450,
        permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true,
            download: true
        },
        customizeThumbnail: function(fileSystemItem) {
            if(fileSystemItem.isDirectory)
                return "../../../../images/thumbnails/folder.svg";

            const fileExtension = fileSystemItem.getFileExtension();
            switch (fileExtension) {
                case ".txt":
                    return "../../../../images/thumbnails/doc-txt.svg";
                case ".rtf":
                    return "../../../../images/thumbnails/doc-rtf.svg";
                case ".xml":
                    return "../../../../images/thumbnails/doc-xml.svg";
            }
        }
    });
});