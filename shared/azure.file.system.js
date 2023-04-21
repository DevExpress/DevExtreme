export class AzureFileSystem {
    constructor(azureGateway) {
        this.gateway = azureGateway;
        this.EMPTY_DIR_DUMMY_BLOB_NAME = 'aspxAzureEmptyFolderBlob';
    }
    getItems(path) {
        var prefix = this.getDirectoryBlobName(path);
        return this.gateway.getBlobList(prefix).then((entries) => this.getDataObjectsFromEntries(entries, prefix));
    }
    createDirectory(path, name) {
        var blobName = path ? `${path}/${name}` : name;
        return this.gateway.createDirectoryBlob(blobName);
    }
    renameFile(path, name) {
        var newPath = this.getPathWithNewName(path, name);
        return this.moveFile(path, newPath);
    }
    renameDirectory(path, name) {
        var newPath = this.getPathWithNewName(path, name);
        return this.moveDirectory(path, newPath);
    }
    getPathWithNewName(path, name) {
        var parts = path.split('/');
        parts[parts.length - 1] = name;
        return parts.join('/');
    }
    deleteFile(path) {
        return this.gateway.deleteBlob(path);
    }
    deleteDirectory(path) {
        var prefix = this.getDirectoryBlobName(path);
        return this.executeActionForEachEntry(prefix, (entry) => this.gateway.deleteBlob(entry.name));
    }
    copyFile(sourcePath, destinationPath) {
        return this.gateway.copyBlob(sourcePath, destinationPath);
    }
    copyDirectory(sourcePath, destinationPath) {
        var prefix = this.getDirectoryBlobName(sourcePath);
        var destinationKey = this.getDirectoryBlobName(destinationPath);
        return this.executeActionForEachEntry(prefix, (entry) => this.copyEntry(entry, prefix, destinationKey));
    }
    copyEntry(entry, sourceKey, destinationKey) {
        var restName = entry.name.substr(sourceKey.length);
        var newDestinationKey = destinationKey + restName;
        return this.gateway.copyBlob(entry.name, newDestinationKey);
    }
    moveFile(sourcePath, destinationPath) {
        return this.gateway.copyBlob(sourcePath, destinationPath).then(() => this.gateway.deleteBlob(sourcePath));
    }
    moveDirectory(sourcePath, destinationPath) {
        var prefix = this.getDirectoryBlobName(sourcePath);
        var destinationKey = this.getDirectoryBlobName(destinationPath);
        return this.executeActionForEachEntry(prefix, (entry) => this.copyEntry(entry, prefix, destinationKey).then(() => this.gateway.deleteBlob(entry.name)));
    }
    downloadFile(path) {
        this.gateway.getBlobUrl(path).then((accessUrls) => {
            window.location.href = accessUrls.url1;
        });
    }
    executeActionForEachEntry(prefix, action) {
        return this.gateway.getBlobList(prefix).then((entries) => {
            var deferreds = entries.map((entry) => action(entry));
            return Promise.all(deferreds);
        });
    }
    getDataObjectsFromEntries(entries, prefix) {
        var result = [];
        var directories = {};
        entries.forEach((entry) => {
            var restName = entry.name.substr(prefix.length);
            var parts = restName.split('/');
            if (parts.length === 1) {
                if (restName !== this.EMPTY_DIR_DUMMY_BLOB_NAME) {
                    var obj = {
                        name: restName,
                        isDirectory: false,
                        dateModified: entry.lastModified,
                        size: entry.length,
                    };
                    result.push(obj);
                }
            }
            else {
                var dirName = parts[0];
                var directory = directories[dirName];
                if (!directory) {
                    directory = {
                        name: dirName,
                        isDirectory: true,
                    };
                    directories[dirName] = directory;
                    result.push(directory);
                }
                if (!directory.hasSubDirectories) {
                    directory.hasSubDirectories = parts.length > 2;
                }
            }
        });
        result.sort(this.compareDataObjects);
        return result;
    }
    compareDataObjects(obj1, obj2) {
        if (obj1.isDirectory === obj2.isDirectory) {
            var name1 = obj1.name.toLowerCase();
            var name2 = obj2.name.toLowerCase();
            if (name1 < name2) {
                return -1;
            }
            return name1 > name2 ? 1 : 0;
        }
        return obj1.isDirectory ? -1 : 1;
    }
    getDirectoryBlobName(path) {
        return path ? `${path}/` : path;
    }
}
export class AzureGateway {
    constructor(endpointUrl, onRequestExecuted) {
        this.endpointUrl = endpointUrl;
        this.onRequestExecuted = onRequestExecuted;
    }
    getBlobList(prefix) {
        return this.getAccessUrl('BlobList')
            .then((accessUrls) => this.executeBlobListRequest(accessUrls.url1, prefix))
            .then((xml) => this.parseEntryListResult(xml));
    }
    parseEntryListResult(xmlString) {
        var xml = new DOMParser().parseFromString(xmlString, 'text/xml');
        return Array.from(xml.querySelectorAll('Blob')).map(this.parseEntry);
    }
    parseEntry(xmlEntry) {
        var entry = {};
        entry.etag = xmlEntry.querySelector('Etag').textContent;
        entry.name = xmlEntry.querySelector('Name').textContent;
        var dateStr = xmlEntry.querySelector('Last-Modified').textContent;
        entry.lastModified = new Date(dateStr);
        var lengthStr = xmlEntry.querySelector('Content-Length').textContent;
        entry.length = parseInt(lengthStr, 10);
        return entry;
    }
    executeBlobListRequest(accessUrl, prefix) {
        var params = {
            restype: 'container',
            comp: 'list',
        };
        if (prefix) {
            params.prefix = prefix;
        }
        return this.executeRequest(accessUrl, params);
    }
    createDirectoryBlob(name) {
        return this.getAccessUrl('CreateDirectory', name).then((accessUrls) => this.executeRequest({
            url: accessUrls.url1,
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
            },
            processData: false,
            contentType: false,
        }));
    }
    deleteBlob(name) {
        return this.getAccessUrl('DeleteBlob', name).then((accessUrls) => this.executeRequest({
            url: accessUrls.url1,
            method: 'DELETE',
        }));
    }
    copyBlob(sourceName, destinationName) {
        return this.getAccessUrl('CopyBlob', sourceName, destinationName).then((accessUrls) => this.executeRequest({
            url: accessUrls.url2,
            method: 'PUT',
            headers: {
                'x-ms-copy-source': accessUrls.url1,
            },
        }));
    }
    putBlock(uploadUrl, blockIndex, blockBlob) {
        var blockId = this.getBlockId(blockIndex);
        var params = {
            comp: 'block',
            blockid: blockId,
        };
        return this.executeRequest({
            url: uploadUrl,
            method: 'PUT',
            data: blockBlob,
            processData: false,
            contentType: false,
        }, params);
    }
    putBlockList(uploadUrl, blockCount) {
        var content = this.getBlockListContent(blockCount);
        var params = {
            comp: 'blocklist',
        };
        return this.executeRequest({
            url: uploadUrl,
            method: 'PUT',
            data: content,
        }, params);
    }
    getBlockListContent(blockCount) {
        var contentParts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<BlockList>',
        ];
        for (var i = 0; i < blockCount; i++) {
            var blockContent = `  <Latest>${this.getBlockId(i)}</Latest>`;
            contentParts.push(blockContent);
        }
        contentParts.push('</BlockList>');
        return contentParts.join('\n');
    }
    getBlockId(blockIndex) {
        var res = `${blockIndex}`;
        while (res.length < 10) {
            res = `0${res}`;
        }
        return btoa(res);
    }
    getUploadAccessUrl(blobName) {
        return this.getAccessUrl('UploadBlob', blobName);
    }
    getBlobUrl(blobName) {
        return this.getAccessUrl('GetBlob', blobName);
    }
    getAccessUrl(command, blobName, blobName2) {
        var url = `${this.endpointUrl}?command=${command}`;
        if (blobName) {
            url += `&blobName=${encodeURIComponent(blobName)}`;
        }
        if (blobName2) {
            url += `&blobName2=${encodeURIComponent(blobName2)}`;
        }
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            await this.executeRequest(url).then((x) => {
                if (x.success) {
                    resolve({ url1: x.accessUrl, url2: x.accessUrl2 });
                }
                else {
                    reject(x.error);
                }
            });
        });
    }
    executeRequest(args, commandParams) {
        var ajaxArgs = typeof args === 'string' ? { url: args } : args;
        var method = ajaxArgs.method || 'GET';
        var urlParts = ajaxArgs.url.split('?');
        var urlPath = urlParts[0];
        var restQueryString = urlParts[1];
        var commandQueryString = commandParams
            ? this.getQueryString(commandParams)
            : '';
        var queryString = commandQueryString || '';
        if (restQueryString) {
            queryString += queryString ? `&${restQueryString}` : restQueryString;
        }
        ajaxArgs.url = queryString ? `${urlPath}?${queryString}` : urlPath;
        return fetch(ajaxArgs.url, ajaxArgs)
            .then((x) => {
            var eventArgs = {
                method,
                urlPath,
                queryString,
            };
            if (this.onRequestExecuted) {
                this.onRequestExecuted(eventArgs);
            }
            return x;
        })
            .then(async (x) => {
            if (x.status === 200) {
                var text = await x.text();
                try {
                    return Object.assign({ success: true }, JSON.parse(text));
                }
                catch (ex) {
                    return text;
                }
            }
            else {
                return { error: x.statusText };
            }
        });
    }
    getQueryString(params) {
        return Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
}
