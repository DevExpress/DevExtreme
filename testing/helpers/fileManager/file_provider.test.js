import { Deferred } from 'core/utils/deferred';

import FileSystemProviderBase from 'file_management/provider_base';
import FileSystemErrorCodes from 'file_management/error_codes';

const DEFAULT_DELAY = 2000;

export default class TestFileSystemProvider extends FileSystemProviderBase {

    constructor(options) {
        super(options);

        this._provider = options.provider;

        this._requestMode = options.requestMode || 'multiple';
        this._raiseErrorMode = options.raiseErrorMode || 'none';
        this._onRaiseError = options.onRaiseError;
    }

    getItems(path) {
        return this._provider.getItems(path);
    }

    renameItem(item, name) {
        return this._doDelay(() => this._renameItemCore(item, name));
    }

    _renameItemCore(item, name) {
        this._raiseError(item, name);
        this._provider.renameItem(item, name);
    }

    createDirectory(parentDir, name) {
        return this._doDelay(() => this._createDirectoryCore(parentDir, name));
    }

    _createDirectoryCore(parentDir, name) {
        this._raiseError();
        this._provider.createDirectory(parentDir, name);
    }

    deleteItems(items) {
        // multiple request
        if(this._useMultipleRequestMode()) {
            return this._getDelayedDeferreds(items, item => this._provider.deleteItems([ item ]));
        }

        // single request
        if(this._useSingleRequestMode()) {
            return this._doDelay(() => this._provider.deleteItems(items));
        }

        // original
        return this._provider.deleteItems(items);
    }

    moveItems(items, destinationDir) {
        // multiple request
        if(this._useMultipleRequestMode()) {
            return this._getDelayedDeferreds(items, item => this._provider.moveItems([ item ], destinationDir));
        }

        // single request
        if(this._useSingleRequestMode()) {
            return this._doDelay(() => this._provider.moveItems(items, destinationDir));
        }

        // original
        return this._provider.moveItems(items, destinationDir);
    }

    copyItems(items, destinationDir) {
        // multiple request
        if(this._useMultipleRequestMode()) {
            return this._getDelayedDeferreds(items, item => this._provider.copyItems([ item ], destinationDir));
        }

        // single request
        if(this._useSingleRequestMode()) {
            return this._doDelay(() => this._provider.copyItems(items, destinationDir));
        }

        // original
        return this._provider.copyItems(items, destinationDir);
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        let deferred = chunksInfo.chunkIndex === 0
            ? this._initiateFileUpload()
            : new Deferred().resolve().promise();

        const delay = chunksInfo.chunkIndex === 0 ? (DEFAULT_DELAY * (1 + 0.15 * chunksInfo.fileIndex)) : DEFAULT_DELAY;

        deferred = deferred.then(() => this._doDelay(() => {
            this._raiseChunkError(chunksInfo.chunkIndex, chunksInfo.fileIndex);
            return this._provider.uploadFileChunk(fileData, chunksInfo, destinationDirectory);
        }, delay, true));

        if(chunksInfo.chunkIndex === chunksInfo.chunkCount - 1) {
            deferred = deferred.then(() => this._finalizeFileUpload());
        }

        return deferred;
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
        return this._doDelay(() => this._provider.abortFileUpload(fileData, chunksInfo, destinationDirectory), DEFAULT_DELAY, true);
    }

    _initiateFileUpload() {
        return this._doDelay(null, 500, true);
    }

    _finalizeFileUpload() {
        return this._doDelay(null, DEFAULT_DELAY, true);
    }

    _getDelayedDeferreds(items, itemAction) {
        return items.map((item, index) => this._doDelay(() => {
            this._raiseError(item, index);
            return itemAction(item, index);
        }, (1 + 0.5 * index) * DEFAULT_DELAY, true));
    }

    _raiseChunkError(chunkIndex, fileIndex) {
        const divider = 2;
        if((chunkIndex + 1) % divider === 0) {
            this._raiseError(null, fileIndex);
        }
    }

    _raiseError(item, index) {
        if(!this._needRaiseError()) {
            return;
        } else if(this._raiseErrorMode === 'always') {
            this._raiseErrorCore(item);
        }

        if(this._onRaiseError) {
            this._onRaiseError(item, index);
        } else {
            const divider = 3;
            if(index === undefined || (index + 1) % divider === 0) {
                this._raiseErrorCore(item);
            }
        }
    }

    _doDelay(action, timeout, skipError) {
        timeout = timeout || DEFAULT_DELAY;
        action = action || (() => {});
        const deferred = new Deferred();
        setTimeout(() => {
            try {
                if(!skipError && this._needRaiseError()) {
                    this._raiseErrorCore();
                }

                const result = action();
                deferred.resolve(result);
            } catch(e) {
                deferred.reject(e);
            }
        }, timeout);
        return deferred.promise();
    }

    _raiseErrorCore(fileItem) {
        fileItem = fileItem || null;
        throw {
            errorId: FileSystemErrorCodes.Other,
            fileItem
        };
    }

    _needRaiseError() {
        return this._raiseErrorMode !== 'none';
    }

    _useDefaultRequestMode() {
        return this._requestModeIs('default');
    }

    _useSingleRequestMode() {
        return this._requestModeIs('single');
    }

    _useMultipleRequestMode() {
        return this._requestModeIs('multiple');
    }

    _requestModeIs(value) {
        return this._requestMode === value;
    }

}
