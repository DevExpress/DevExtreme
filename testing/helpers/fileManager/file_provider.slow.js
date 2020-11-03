import { Deferred } from 'core/utils/deferred';
import { createTestFileSystem, stubFileReader } from '../fileManagerHelpers.js';
import CustomFileSystemProvider from 'file_management/custom_provider';
import ObjectFileSystemProvider from 'file_management/object_provider';

export default class SlowFileProvider extends CustomFileSystemProvider {
    constructor(options) {
        const providerPredefinedOptions = {
            getItems: function(item) {
                return this._realProviderInstance.getItems(item);
            },
            createDirectory: function(parentDir, name) {
                return this._doDelay(() => this._realProviderInstance.createDirectory(parentDir, name));
            },
            moveItem: function(item, destinationDir) {
                return this._doDelay(() => this._realProviderInstance.moveItems([item.dataItem], destinationDir.dataItem));
            },
            copyItem: function(item, destinationDir) {
                return this._doDelay(() => this._realProviderInstance.copyItems([item.dataItem], destinationDir.dataItem));
            },
            uploadFileChunk: function(fileData, chunksInfo, destinationDir) {
                return this._doDelay(() => this._realProviderInstance.uploadFileChunk(fileData, chunksInfo, destinationDir));
            }
        };

        super(providerPredefinedOptions);
        this._realProviderInstance = new ObjectFileSystemProvider({ data: createTestFileSystem() });
        stubFileReader(this._realProviderInstance);
        this._operationTimeout = options['operationDelay'];
    }

    _doDelay(action) {
        const promise = new Deferred();

        setTimeout(function() {
            try {
                const actionResult = action();
                promise.resolve(actionResult);
            } catch(e) {
                promise.reject(e);
            }
        }, this._operationTimeout);

        return promise.promise();
    }
}
