import { Deferred } from 'core/utils/deferred';
import { createTestFileSystem } from '../fileManagerHelpers.js';
import CustomFileSystemProvider from 'file_management/custom_provider';
import ObjectFileSystemProvider from 'file_management/object_provider';

export default class NoDuplicatesFileProvider extends CustomFileSystemProvider {
    constructor(options) {
        const providerPredefinedOptions = {
            getItems: function(item) {
                return this._realProviderInstance.getItems(item);
            },
            createDirectory: function(parentDir, name) {
                return this._executeIfItemNotExists(() => this._realProviderInstance.createDirectory(parentDir, name), 3, name);
            },
            renameItem: function(item, name) {
                return this._executeIfItemNotExists(() => this._realProviderInstance.renameItem(item.dataItem, name), item.isDirectory ? 3 : 1, name);
            }
        };

        super(providerPredefinedOptions);
        this._realProviderInstance = new ObjectFileSystemProvider({ data: createTestFileSystem() });
        this._parentDir = options['currentDirectory'];
    }

    get parentDir() {
        return this._parentDir();
    }

    _executeIfItemNotExists(onSuccess, errorCode, itemName) {
        const promise = new Deferred();
        this.getItems(this.parentDir).then(items => {
            const duplicateItems = items.filter(i => i.name === itemName);
            if(duplicateItems.length !== 0) {
                promise.reject({ errorCode }).promise();
            } else {
                promise.resolve(onSuccess()).promise();
            }
        });
        return promise.promise();
    }
}
