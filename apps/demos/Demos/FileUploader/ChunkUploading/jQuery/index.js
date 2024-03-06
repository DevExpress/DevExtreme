$(() => {
  $('#file-uploader').dxFileUploader({
    name: 'file',
    accept: 'image/*',
    uploadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/ChunkUpload',
    chunkSize: 200000,
    onUploadStarted,
    onProgress: onUploadProgress,
  });
});

function onUploadStarted() {
  getChunkPanel().innerHTML = '';
}
function onUploadProgress(e) {
  getChunkPanel().appendChild(addChunkInfo(e.segmentSize, e.bytesLoaded, e.bytesTotal));
}

function addChunkInfo(segmentSize, loaded, total) {
  const result = document.createElement('DIV');

  result.appendChild(createSpan('Chunk size:'));
  result.appendChild(createSpan(getValueInKb(segmentSize), 'segment-size'));
  result.appendChild(createSpan(', Uploaded:'));
  result.appendChild(createSpan(getValueInKb(loaded), 'loaded-size'));
  result.appendChild(createSpan('/'));
  result.appendChild(createSpan(getValueInKb(total), 'total-size'));

  return result;
}
function getValueInKb(value) {
  return `${(value / 1024).toFixed(0)}kb`;
}
function createSpan(text, className) {
  const result = document.createElement('SPAN');
  if (className) { result.className = className; }
  result.innerText = text;
  return result;
}
function getChunkPanel() {
  return document.querySelector('.chunk-panel');
}
