import { Deferred } from 'core/utils/deferred';
import { createTestFileSystem, stubFileReader } from '../fileManagerHelpers.js';
import CustomFileSystemProvider from 'file_management/custom_provider';
import ObjectFileSystemProvider from 'file_management/object_provider';

export default class SlowFileProvider extends CustomFileSystemProvider {
    constructor(options) {
        const providerPredefinedOptions = {
            getItems: function(item) {
                return this._doDelay(() => this._realProviderInstance.getItems(item), 'r');
            },
            createDirectory: function(parentDir, name) {
                return this._doDelay(() => this._realProviderInstance.createDirectory(parentDir, name), 'c');
            },
            moveItem: function(item, destinationDir) {
                return this._doDelay(() => this._realProviderInstance.moveItems([item.dataItem], destinationDir.dataItem), 'u');
            },
            copyItem: function(item, destinationDir) {
                return this._doDelay(() => this._realProviderInstance.copyItems([item.dataItem], destinationDir.dataItem), 'u');
            },
            deleteItem: function(item) {
                return this._doDelay(() => this._realProviderInstance.deleteItems([item.dataItem]), 'd');
            },
            uploadFileChunk: function(fileData, chunksInfo, destinationDir) {
                return this._doDelay(() => this._realProviderInstance.uploadFileChunk(fileData, chunksInfo, destinationDir), 'u');
            }
        };

        super(providerPredefinedOptions);
        this._realProviderInstance = options['realProviderInstance'] || new ObjectFileSystemProvider({ data: createTestFileSystem() });
        this._realProviderInstance['_createFileReader'] && stubFileReader(this._realProviderInstance);
        this._operationTimeout = options['operationDelay'];
        this._operationTimeouts = options['operationDelays'];
        this._operationIndex = 0;
        this._operationsToDelay = options['operationsToDelay'];
        this._exceptionThrown = options['exceptionThrown'];
    }

    _doDelay(action, operationType) {
        const promise = new Deferred();
        let operationTimeout = 0;
        if(this._operationsToDelay.indexOf(operationType) !== -1) {
            operationTimeout = this._operationTimeouts && this._operationTimeouts.length > this._operationIndex
                ? this._operationTimeouts[this._operationIndex++]
                : this._operationTimeout;
        }

        setTimeout(() => {
            try {
                const actionResult = action();
                if(actionResult.then) {
                    actionResult.then(result => promise.resolve(result));
                } else {
                    promise.resolve(actionResult);
                }
            } catch(e) {
                this._exceptionThrown && this._exceptionThrown(e);
                promise.reject(e);
            }
        }, operationTimeout);

        return promise.promise();
    }
}
