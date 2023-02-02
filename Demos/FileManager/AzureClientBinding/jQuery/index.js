$(() => {
  const loadPanel = $('#load-panel').dxLoadPanel({
    position: { of: '#file-manager' },
  }).dxLoadPanel('instance');

  $.ajax({
    url: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager',
    success(result) {
      const className = result.active ? 'show-widget' : 'show-message';
      $('#wrapper').addClass(className);
      loadPanel.hide();
    },
  });

  const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
  gateway = new AzureGateway(endpointUrl, onRequestExecuted);
  azure = new AzureFileSystem(gateway);

  const provider = new DevExpress.fileManagement.CustomFileSystemProvider({
    getItems,
    createDirectory,
    renameItem,
    deleteItem,
    copyItem,
    moveItem,
    uploadFileChunk,
    downloadItems,
  });

  $('#file-manager').dxFileManager({
    fileSystemProvider: provider,
    allowedFileExtensions: [],
    upload: {
      maxFileSize: 1048576,
    },
    permissions: {
      download: true,
      // uncomment the code below to enable file/directory management
      /* create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true */
    },
  });
});

function getItems(parentDirectory) {
  return azure.getItems(parentDirectory.path);
}

function createDirectory(parentDirectory, name) {
  return azure.createDirectory(parentDirectory.path, name);
}

function renameItem(item, name) {
  return item.isDirectory
    ? azure.renameDirectory(item.path, name)
    : azure.renameFile(item.path, name);
}

function deleteItem(item) {
  return item.isDirectory ? azure.deleteDirectory(item.path) : azure.deleteFile(item.path);
}

function copyItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory
    ? azure.copyDirectory(item.path, destinationPath)
    : azure.copyFile(item.path, destinationPath);
}

function moveItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory
    ? azure.moveDirectory(item.path, destinationPath)
    : azure.moveFile(item.path, destinationPath);
}

function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
  let promise = null;

  if (uploadInfo.chunkIndex === 0) {
    const filePath = destinationDirectory.path ? `${destinationDirectory.path}/${fileData.name}` : fileData.name;
    // eslint-disable-next-line spellcheck/spell-checker
    promise = gateway.getUploadAccessUrl(filePath).then((accessUrls) => {
      // eslint-disable-next-line spellcheck/spell-checker
      uploadInfo.customData.accessUrl = accessUrls.url1;
    });
  } else {
    promise = Promise.resolve();
  }

  promise = promise.then(() => gateway.putBlock(
    uploadInfo.customData.accessUrl,
    uploadInfo.chunkIndex,
    uploadInfo.chunkBlob,
  ));

  if (uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
    promise = promise.then(() => gateway.putBlockList(
      uploadInfo.customData.accessUrl,
      uploadInfo.chunkCount,
    ));
  }

  return promise;
}

function downloadItems(items) {
  azure.downloadFile(items[0].path);
}

function onRequestExecuted(e) {
  $('<div>').addClass('request-info').append(
    createParameterInfoDiv('Method:', e.method),
    createParameterInfoDiv('Url path:', e.urlPath),
    createParameterInfoDiv('Query string:', e.queryString),
    $('<br>'),
  )
    .prependTo('#request-panel');
}

function createParameterInfoDiv(name, value) {
  return $('<div>').addClass('parameter-info').append(
    $('<div>').addClass('parameter-name').text(name),
    $('<div>').addClass('parameter-value dx-theme-accent-as-text-color').text(value).attr('title', value),
  );
}

let gateway = null;
let azure = null;
