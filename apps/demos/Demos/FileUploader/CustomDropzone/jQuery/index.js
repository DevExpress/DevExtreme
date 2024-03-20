$(() => {
  $('#file-uploader').dxFileUploader({
    dialogTrigger: '#dropzone-external',
    dropZone: '#dropzone-external',
    multiple: false,
    allowedFileExtensions: ['.jpg', '.jpeg', '.gif', '.png'],
    uploadMode: 'instantly',
    uploadUrl: 'https://js.devexpress.com/Demos/NetCore/FileUploader/Upload',
    visible: false,
    onDropZoneEnter({ component, dropZoneElement, event }) {
      if (dropZoneElement.id === 'dropzone-external') {
        const items = event.originalEvent.dataTransfer.items;

        const allowedFileExtensions = component.option('allowedFileExtensions');
        const draggedFileExtension = `.${items[0].type.replace(/^image\//, '')}`;

        const isSingleFileDragged = items.length === 1;
        const isValidFileExtension = allowedFileExtensions.includes(draggedFileExtension);

        if (isSingleFileDragged && isValidFileExtension) {
          toggleDropZoneActive(dropZoneElement, true);
        }
      }
    },
    onDropZoneLeave(e) {
      if (e.dropZoneElement.id === 'dropzone-external') { toggleDropZoneActive(e.dropZoneElement, false); }
    },
    onUploaded(e) {
      const { file } = e;
      const dropZoneText = document.getElementById('dropzone-text');
      const fileReader = new FileReader();
      fileReader.onload = function () {
        toggleDropZoneActive(document.getElementById('dropzone-external'), false);
        const dropZoneImage = document.getElementById('dropzone-image');
        dropZoneImage.src = fileReader.result;
      };
      fileReader.readAsDataURL(file);
      dropZoneText.style.display = 'none';
      uploadProgressBar.option({
        visible: false,
        value: 0,
      });
    },
    onProgress(e) {
      uploadProgressBar.option('value', (e.bytesLoaded / e.bytesTotal) * 100);
    },
    onUploadStarted() {
      toggleImageVisible(false);
      uploadProgressBar.option('visible', true);
    },
  });

  const uploadProgressBar = $('#upload-progress').dxProgressBar({
    min: 0,
    max: 100,
    width: '30%',
    showStatus: false,
    visible: false,
  }).dxProgressBar('instance');

  function toggleDropZoneActive(dropZone, isActive) {
    dropZone.classList.toggle('dropzone-active', isActive);
  }

  function toggleImageVisible(visible) {
    const dropZoneImage = document.getElementById('dropzone-image');
    dropZoneImage.hidden = !visible;
  }

  document.getElementById('dropzone-image').onload = function () { toggleImageVisible(true); };
});
