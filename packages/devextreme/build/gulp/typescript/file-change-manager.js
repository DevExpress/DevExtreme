'use strict';

const { v4, v5 } = require('uuid');
const generateUuid = v4;
const uuidFromStr = v5;


const createFileChangeManager = () => {
    const seed = generateUuid();
    const fileMap = new Map();
    const touchedFileSet = new Set();

    const generateUuidFromFileData = (fileData) => uuidFromStr(fileData, seed);

    const checkFileChanged = (filePath, fileData) => {
        const newUuid = generateUuidFromFileData(fileData);
        touchedFileSet.add(filePath);

        if(!fileMap.has(filePath)) {
            fileMap.set(filePath, newUuid);
            return true;
        }

        const oldUuid = fileMap.get(filePath);
        const isChanged = oldUuid !== newUuid;

        if(isChanged) {
            fileMap.set(filePath, newUuid);
        }

        return isChanged;
    };

    const clearUntouchedFiles = () => {
        fileMap.forEach((_, filePath) => {
            if(!touchedFileSet.has(filePath)) {
                fileMap.delete(filePath);
            }
        });
        touchedFileSet.clear();
    };

    return {
        checkFileChanged,
        clearUntouchedFiles,
    };
};

module.exports = createFileChangeManager;
