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
        this._realProviderInstance = new ObjectFileSystemProvider({ data: createTestFileSystem() });
        stubFileReader(this._realProviderInstance);
        this._operationTimeout = options['operationDelay'];
        this._operationsToDelay = options['operationsToDelay'];
    }

    _doDelay(action, operationType) {
        const promise = new Deferred();

        setTimeout(function() {
            try {
                const actionResult = action();
                if(actionResult.then) {
                    actionResult.then(result => promise.resolve(result));
                } else {
                    promise.resolve(actionResult);
                }
            } catch(e) {
                promise.reject(e);
            }
        }, this._operationsToDelay.indexOf(operationType) !== -1 ? this._operationTimeout : 0);

        return promise.promise();
    }
}
