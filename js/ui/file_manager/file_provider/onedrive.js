import ajax from '../../../core/utils/ajax';
import { Deferred } from '../../../core/utils/deferred';
import { noop } from '../../../core/utils/common';

import { FileProvider } from './file_provider';

const REQUIRED_ITEM_FIELDS = 'id,name,folder,lastModifiedDateTime,size,parentReference';
const REST_API_URL = 'https://graph.microsoft.com/';
const DRIVE_API_URL = REST_API_URL + 'v1.0/drive';
const APP_ROOT_URL = DRIVE_API_URL + '/special/approot';

/**
* @name OneDriveFileProvider
* @inherits FileProvider
* @type object
* @module ui/file_manager/file_provider/onedrive
* @export default
*/
class OneDriveFileProvider extends FileProvider {

    constructor(options) {
        /**
         * @name OneDriveFileProviderOptions.nameExpr
         * @hidden
         */
        /**
         * @name OneDriveFileProviderOptions.isDirectoryExpr
         * @hidden
         */
        /**
         * @name OneDriveFileProviderOptions.sizeExpr
         * @hidden
         */
        /**
         * @name OneDriveFileProviderOptions.dateModifiedExpr
         * @hidden
         */
        /**
         * @name OneDriveFileProviderOptions.thumbnailExpr
         * @hidden
         */

        options = options || {};
        options.dateModifiedExpr = 'lastModifiedDateTime';
        options.isDirectoryExpr = 'folder';
        super(options);

        this._getAccessTokenUrl = options.getAccessTokenUrl || '';

        this._accessToken = '';
        this._accessTokenPromise = null;
    }

    get _authorizationString() {
        return `Bearer ${this._accessToken}`;
    }

    getItems(path, itemType) {
        return this._getItems(path, itemType);
    }

    initiateFileUpload(uploadInfo) {
        const folderPath = uploadInfo.destinationFolder.relativeName;
        const fileName = uploadInfo.file.name;
        const customData = uploadInfo.customData;

        return this._ensureAccessTokenAcquired()
            .then(() => this._createFile(folderPath, fileName))
            .then(entry => {
                return this._initiateUploadSession(entry.id)
                    .done(info => { customData.uploadUrl = info.uploadUrl; });
            });
    }

    uploadFileChunk({ customData, uploadedBytesCount, file }, { blob, size }) {
        return this._uploadFileChunk(customData.uploadUrl, blob, size, uploadedBytesCount, file.size);
    }

    abortFileUpload(uploadInfo) {
        return this._ensureAccessTokenAcquired()
            .then(() => this._cancelUploadSession(uploadInfo.customData.uploadUrl));
    }

    _getItems(path, itemType) {
        return this._ensureAccessTokenAcquired()
            .then(() => this._getEntriesByPath(path))
            .then(entries => this._convertDataObjectsToFileItems(entries.children, path, itemType));
    }

    _ensureAccessTokenAcquired() {
        if(this._accessTokenPromise) {
            return this._accessTokenPromise;
        }

        const deferred = new Deferred();

        if(this._accessToken) {
            deferred.resolve();
        } else {
            ajax.sendRequest({
                url: this._getAccessTokenUrl,
                dataType: 'json'
            }).done(({ token }) => {
                this._accessToken = token;
                this._accessTokenPromise = null;
                deferred.resolve();
            });
        }

        this._accessTokenPromise = deferred.promise();
        return this._accessTokenPromise;
    }

    _getEntriesByPath(path) {
        const itemPath = this._prepareItemRelativePath(path);
        const queryString = `?$select=${REQUIRED_ITEM_FIELDS}&$expand=children($select=${REQUIRED_ITEM_FIELDS})`;
        const url = APP_ROOT_URL + itemPath + queryString;
        return ajax.sendRequest({
            url: url,
            dataType: 'json',
            cache: false,
            headers: { 'Authorization': this._authorizationString }
        });
    }

    _uploadFileChunk(uploadUrl, chunkBlob, chunkSize, uploadedSize, totalSize) {
        const chunkEndPosition = uploadedSize + chunkSize - 1;
        const contentRange = `bytes ${uploadedSize}-${chunkEndPosition}/${totalSize}`;
        return ajax.sendRequest({
            url: uploadUrl,
            method: 'PUT',
            dataType: 'json',
            data: chunkBlob,
            upload: {
                onprogress: noop,
                onloadstart: noop,
                onabort: noop
            },
            cache: false,
            headers: {
                'Authorization': this._authorizationString,
                'Content-Range': contentRange
            }
        });
    }

    _initiateUploadSession(fileId) {
        const url = `${DRIVE_API_URL}/items/${fileId}/createUploadSession`;
        return ajax.sendRequest({
            url: url,
            method: 'POST',
            dataType: 'json',
            cache: false,
            headers: { 'Authorization': this._authorizationString }
        });
    }

    _createFile(folderPath, objectName) {
        const itemPath = this._prepareItemRelativePath(folderPath);
        const queryString = `?$select=${REQUIRED_ITEM_FIELDS}`;
        const url = APP_ROOT_URL + itemPath + '/children' + queryString;

        const params = {
            'name': objectName,
            'file': { },
            '@microsoft.graph.conflictBehavior': 'rename'
        };
        const data = JSON.stringify(params);

        return ajax.sendRequest({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: data,
            cache: false,
            headers: {
                'Authorization': this._authorizationString,
                'Content-Type': 'application/json'
            }
        });
    }

    _cancelUploadSession(uploadUrl) {
        return ajax.sendRequest({
            url: uploadUrl,
            method: 'DELETE',
            dataType: 'json',
            cache: false,
            headers: {
                'Authorization': this._authorizationString
            }
        });
    }

    _prepareItemRelativePath(path) {
        return path === '' ? '' : `:/${path}:`;
    }

    _hasSubDirs(dataObj) {
        return Object.prototype.hasOwnProperty.call(dataObj, 'folder') && dataObj.folder.childCount > 0;
    }

}

module.exports = OneDriveFileProvider;
