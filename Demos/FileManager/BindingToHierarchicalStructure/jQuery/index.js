$(function () {
    $("#file-manager").dxFileManager({
        name: "fileManager",
        fileSystemProvider: fileSystem,
        height: 450,
        permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true,
            download: true
        }
    });
});
