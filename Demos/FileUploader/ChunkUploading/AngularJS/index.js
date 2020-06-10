var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.fileUploader = {
		name: "file",
        accept: "image/*",
        uploadUrl: "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/ChunkUpload",
        chunkSize: 200000,
		onUploadStarted: onUploadStarted,
		onProgress: onUploadProgress
    };
});

function onUploadStarted(e) {
	getChunkPanel().innerHTML = '';
}
function onUploadProgress(e) {
	getChunkPanel().appendChild(addChunkInfo(e.segmentSize, e.bytesLoaded, e.bytesTotal));
}

function addChunkInfo(segmentSize, loaded, total) {
	var result = document.createElement("DIV");

	result.appendChild(createSpan("Chunk size:"));
	result.appendChild(createSpan(getValueInKb(segmentSize), 'segment-size'));
	result.appendChild(createSpan(", Uploaded:"));
	result.appendChild(createSpan(getValueInKb(loaded), 'loaded-size'));
	result.appendChild(createSpan("/"));
	result.appendChild(createSpan(getValueInKb(total), 'total-size'));

	return result;
}
function getValueInKb(value) {
	return (value / 1024).toFixed(0) + "kb";
}
function createSpan(text, className) {
	var result = document.createElement("SPAN");
	if (className)
		result.className = className + " dx-theme-accent-as-text-color";
	result.innerText = text;
	return result;
}
function getChunkPanel() {
	return document.querySelector('.chunk-panel');
}