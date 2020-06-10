var AzureFileSystem = function(azureGateway) {
    var EMPTY_DIR_DUMMY_BLOB_NAME = "aspxAzureEmptyFolderBlob";

    var gateway = azureGateway;

    var getItems = function(path) {
        var prefix = getDirectoryBlobName(path);
        return gateway.getBlobList(prefix)
            .then(function(entries) {
                return getDataObjectsFromEntries(entries, prefix);
            });
    };

    var createDirectory = function(path, name) {
        var blobName = path ? path + "/" + name : name;
        return gateway.createDirectoryBlob(blobName);
    };

    var renameFile = function(path, name) {
        var newPath = getPathWithNewName(path, name);
        return moveFile(path, newPath);
    };

    var renameDirectory = function(path, name) {
        var newPath = getPathWithNewName(path, name);
        return moveDirectory(path, newPath);
    };

    var getPathWithNewName = function(path, name) {
        var parts = path.split("/");
        parts[parts.length - 1] = name;
        return parts.join("/");
    };

    var deleteFile = function(path) {
        return gateway.deleteBlob(path);
    };

    var deleteDirectory = function(path) {
        var prefix = getDirectoryBlobName(path);
        return executeActionForEachEntry(prefix, function(entry) {
            return gateway.deleteBlob(entry.name);
        });
    };

    var copyFile = function(sourcePath, destinationPath) {
        return gateway.copyBlob(sourcePath, destinationPath);
    };

    var copyDirectory = function(sourcePath, destinationPath) {
        var prefix = getDirectoryBlobName(sourcePath);
        var destinationKey = getDirectoryBlobName(destinationPath);
        return executeActionForEachEntry(prefix, function(entry) {
            return copyEntry(entry, prefix, destinationKey);
        });
    };

    var copyEntry = function(entry, sourceKey, destinationKey) {
        var restName = entry.name.substr(sourceKey.length);
        var newDestinationKey = destinationKey + restName;
        return gateway.copyBlob(entry.name, newDestinationKey);
    };

    var moveFile = function(sourcePath, destinationPath) {
        return gateway.copyBlob(sourcePath, destinationPath)
            .then(function() {
                gateway.deleteBlob(sourcePath);
            });
    };

    var moveDirectory = function(sourcePath, destinationPath) {
        var prefix = getDirectoryBlobName(sourcePath);
        var destinationKey = getDirectoryBlobName(destinationPath);
        return executeActionForEachEntry(prefix, function(entry) {
            return copyEntry(entry, prefix, destinationKey)
                .then(function() {
                    gateway.deleteBlob(entry.name);
                });
        });
    };

    var downloadFile = function(path) {
        gateway.getBlobUrl(path)
            .done(function(accessUrl) {
                window.location.href = accessUrl;
            });
    };

    var executeActionForEachEntry = function(prefix, action) {
        return gateway.getBlobList(prefix)
            .then(function(entries) {
                var deferreds = entries.map(function(entry) {
                    return action(entry);
                });
                return $.when.apply(null, deferreds);
            });
    };

    var getDataObjectsFromEntries = function(entries, prefix) {
        var result = [];
        var directories = {};

        entries.forEach(function(entry) {
            var restName = entry.name.substr(prefix.length);
            var parts = restName.split("/");

            if(parts.length === 1) {
                if(restName !== EMPTY_DIR_DUMMY_BLOB_NAME) {
                    var obj = {
                        name: restName,
                        isDirectory: false,
                        dateModified: entry.lastModified,
                        size: entry.length
                    };
                    result.push(obj);
                }
            } else {
                var dirName = parts[0];
                var directory = directories[dirName];
                if(!directory) {
                    directory = {
                        name: dirName,
                        isDirectory: true
                    };
                    directories[dirName] = directory;
                    result.push(directory);
                }

                if(!directory.hasSubDirectories) {
                    directory.hasSubDirectories = parts.length > 2;
                }
            }
        });

        result.sort(compareDataObjects);

        return result;
    };

    var compareDataObjects = function(obj1, obj2) {
        if(obj1.isDirectory === obj2.isDirectory) {
            var name1 = obj1.name.toLowerCase();
            var name2 = obj1.name.toLowerCase();
            if(name1 < name2) {
                return -1;
            } else {
                return name1 > name2 ? 1 : 0;
            }
        }

        return obj1.isDirectory ? -1 : 1;
    };

    var getDirectoryBlobName = function(path) {
        return path ? path + "/" : path;
    };

    return {
        getItems: getItems,
        createDirectory: createDirectory,
        renameFile: renameFile,
        renameDirectory: renameDirectory,
        deleteFile: deleteFile,
        deleteDirectory: deleteDirectory,
        copyFile: copyFile,
        copyDirectory: copyDirectory,
        moveFile: moveFile,
        moveDirectory: moveDirectory,
        downloadFile: downloadFile
    };
};

var AzureGateway = function(endpointUrl, onRequestExecuted) {

    var getBlobList = function(prefix) {
        return getAccessUrl("BlobList")
            .then(function(accessUrl) {
                return executeBlobListRequest(accessUrl, prefix);
            }).then(function(xml) {
                return parseEntryListResult(xml);
            });
    };

    var parseEntryListResult = function(xml) {
        return $(xml).find("Blob")
            .map(function(i, xmlEntry) {
                var entry = {};
                parseEntry($(xmlEntry), entry);
                return entry;
            })
            .get();
    };

    var parseEntry = function($xmlEntry, entry) {
        entry.etag = $xmlEntry.find("Etag").text();
        entry.name = $xmlEntry.find("Name").text();

        var dateStr = $xmlEntry.find("Last-Modified").text();
        entry.lastModified = new Date(dateStr);

        var lengthStr = $xmlEntry.find("Content-Length").text();
        entry.length = parseInt(lengthStr);
    };

    var executeBlobListRequest = function(accessUrl, prefix) {
        var params = {
            "restype": "container",
            "comp": "list"
        };
        if(prefix) {
            params.prefix = prefix;
        }
        return executeRequest(accessUrl, params);
    };

    var createDirectoryBlob = function(name) {
        return getAccessUrl("CreateDirectory", name)
            .then(function(accessUrl) {
                return executeRequest({
                    url: accessUrl,
                    method: "PUT",
                    headers: {
                        "x-ms-blob-type": "BlockBlob"
                    },
                    processData: false,
                    contentType: false
                });
            });
    };

    var deleteBlob = function(name) {
        return getAccessUrl("DeleteBlob", name)
            .then(function(accessUrl) {
                return executeRequest({
                    url: accessUrl,
                    method: "DELETE"
                });
            });
    };

    var copyBlob = function(sourceName, destinationName) {
        return getAccessUrl("CopyBlob", sourceName, destinationName)
            .then(function(accessUrl, accessUrl2) {
                return executeRequest({
                    url: accessUrl2,
                    method: "PUT",
                    headers: {
                        "x-ms-copy-source": accessUrl
                    }
                });
            });
    };

    var putBlock = function(uploadUrl, blockIndex, blockBlob) {
        var blockId = getBlockId(blockIndex);
        var params = {
            "comp": "block",
            "blockid": blockId
        };
        return executeRequest({
            url: uploadUrl,
            method: "PUT",
            data: blockBlob,
            processData: false,
            contentType: false
        }, params);
    };

    var putBlockList = function(uploadUrl, blockCount) {
        var content = getBlockListContent(blockCount);
        var params = {
            "comp": "blocklist"
        };
        return executeRequest({
            url: uploadUrl,
            method: "PUT",
            data: content
        }, params);
    };

    var getBlockListContent = function(blockCount) {
        var contentParts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<BlockList>'
        ];

        for(var i = 0; i < blockCount; i++) {
            var blockContent = '  <Latest>' + getBlockId(i) + '</Latest>';
            contentParts.push(blockContent);
        }

        contentParts.push('</BlockList>');
        return contentParts.join('\n');
    };

    var getBlockId = function(blockIndex) {
        var res = blockIndex + "";
        while(res.length < 10) {
            res = "0" + res;
        }
        return btoa(res);
    };

    var getUploadAccessUrl = function(blobName) {
        return getAccessUrl("UploadBlob", blobName);
    };

    var getBlobUrl = function(blobName) {
        return getAccessUrl("GetBlob", blobName);
    };

    var getAccessUrl = function(command, blobName, blobName2) {
        var deferred = $.Deferred();
        var url = endpointUrl + "?command=" + command;
        if(blobName) {
            url += "&blobName=" + encodeURIComponent(blobName);
        }
        if(blobName2) {
            url += "&blobName2=" + encodeURIComponent(blobName2);
        }

        executeRequest(url)
            .done(function(result) {
                if(result.success) {
                    deferred.resolve(result.accessUrl, result.accessUrl2);
                } else {
                    deferred.reject(result.error);
                }
            })
            .fail(deferred.reject);

        return deferred.promise();
    };

    var executeRequest = function(args, commandParams) {
        var ajaxArgs = typeof args === "string" ? { url: args } : args;

        var method = ajaxArgs.method || "GET";

        var urlParts = ajaxArgs.url.split("?");
        var urlPath = urlParts[0];
        var restQueryString = urlParts[1];
        var commandQueryString = commandParams ? getQueryString(commandParams) : "";

        var queryString = commandQueryString || "";
        if(restQueryString) {
            queryString += queryString ? "&" + restQueryString : restQueryString;    
        }

        ajaxArgs.url = queryString ? urlPath + "?" + queryString : urlPath;

        return $.ajax(ajaxArgs)
            .done(function() {
                var eventArgs = {
                    method: method,
                    urlPath: urlPath,
                    queryString: queryString
                };
                if(onRequestExecuted) {
                    onRequestExecuted(eventArgs);
                }
            });
    };

    var getQueryString = function(params) {
        return Object.keys(params)
            .map(function(key) {
                return key + "=" + encodeURIComponent(params[key]);
            })
            .join("&");
    };

    return {
        getBlobList: getBlobList,
        createDirectoryBlob: createDirectoryBlob,
        deleteBlob: deleteBlob,
        copyBlob: copyBlob,
        putBlock: putBlock,
        putBlockList: putBlockList,
        getUploadAccessUrl: getUploadAccessUrl,
        getBlobUrl: getBlobUrl
    };
};
