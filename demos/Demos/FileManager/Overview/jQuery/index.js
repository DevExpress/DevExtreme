$(() => {
  const provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
    endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images',
  });

  $('#file-manager').dxFileManager({
    name: 'fileManager',
    fileSystemProvider: provider,
    currentPath: 'Widescreen',
    permissions: {
      create: true,
      copy: true,
      move: true,
      delete: true,
      rename: true,
      upload: true,
      download: true,
    },
    onSelectedFileOpened(e) {
      const popup = $('#photo-popup').dxPopup('instance');
      popup.option({
        title: e.file.name,
        contentTemplate: `<img src="${e.file.dataItem.url}" class="photo-popup-image" />`,
      });
      popup.show();
    },
  });

  $('#photo-popup').dxPopup({
    maxHeight: 600,
    hideOnOutsideClick: true,
    showCloseButton: true,
    onContentReady(e) {
      const $contentElement = e.component.content();
      $contentElement.addClass('photo-popup-content');
    },
  });
});
