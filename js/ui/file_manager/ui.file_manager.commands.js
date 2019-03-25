let tryCreateFolder = function(fileManager) {
    fileManager._editing.tryCreate();
};

let tryRename = function(fileManager, fileItem) {
    if(Array.isArray(fileItem)) {
        fileItem = fileItem.length === 1 ? fileItem[0] : null;
    }
    fileManager._editing.tryRename(fileItem);
};

let tryMove = function(fileManager, fileItems) {
    fileManager._editing.tryMove(fileItems);
};

let tryCopy = function(fileManager, fileItems) {
    fileManager._editing.tryCopy(fileItems);
};

let tryDelete = function(fileManager, fileItems) {
    fileManager._editing.tryDelete(fileItems);
};

let tryDownload = function(fileManager) {
    // TODO not implemeneted
};

let switchViewToThumbnails = function(fileManager) {
    fileManager._switchView("thumbnails");
};

let switchViewToDetails = function(fileManager) {
    fileManager._switchView("details");
};

export const FileManagerFileCommands = [
    {
        name: 'create',
        text: 'Create folder',
        handler: tryCreateFolder
    },
    {
        name: 'rename',
        text: 'Rename',
        isSingleFileItemCommand: true,
        handler: tryRename
    },
    {
        name: 'move',
        text: 'Move',
        handler: tryMove
    },
    {
        name: 'copy',
        text: 'Copy',
        handler: tryCopy
    },
    {
        name: 'delete',
        text: 'Delete',
        handler: tryDelete
    },
    {
        name: "download",
        text: "Download",
        handler: tryDownload
    },

    {
        name: 'thumbnails',
        text: "Thumbnails View",
        displayInToolbarOnly: true,
        handler: switchViewToThumbnails
    },
    {
        name: 'details',
        text: "Details View",
        displayInToolbarOnly: true,
        handler: switchViewToDetails
    }
];
