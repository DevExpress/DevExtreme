<template>
  <div class="widget-container flex-box">
    <span>Profile Picture</span>
    <div
      id="dropzone-external"
      class="flex-box"
      :class="[isDropZoneActive
        ? 'dropzone-active'
        : '']"
    >
      <img
        id="dropzone-image"
        :src="imageSource"
        v-if="imageSource"
        alt=""
      >
      <div
        id="dropzone-text"
        class="flex-box"
        v-if="textVisible"
      >
        <span>Drag & Drop the desired file</span>
        <span>…or click to browse for a file instead.</span>
      </div>
      <DxProgressBar
        id="upload-progress"
        :min="0"
        :max="100"
        width="30%"
        :show-status="false"
        :visible="progressVisible"
        :value="progressValue"
      />
    </div>
    <DxFileUploader
      id="file-uploader"
      dialog-trigger="#dropzone-external"
      drop-zone="#dropzone-external"
      :multiple="false"
      :allowed-file-extensions="allowedFileExtensions"
      upload-mode="instantly"
      upload-url="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
      :visible="false"
      @drop-zone-enter="onDropZoneEnter"
      @drop-zone-leave="onDropZoneLeave"
      @uploaded="onUploaded"
      @progress="onProgress"
      @upload-started="onUploadStarted"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxProgressBar } from 'devextreme-vue/progress-bar';

const isDropZoneActive = ref(false);
const imageSource = ref('');
const textVisible = ref(true);
const progressVisible = ref(false);
const progressValue = ref(0);
const allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];

function onDropZoneEnter({ component, dropZoneElement, event }) {
  if (dropZoneElement.id === 'dropzone-external') {
    const items = event.originalEvent.dataTransfer.items;

    const allowedFileExtensions = component.option('allowedFileExtensions');
    const draggedFileExtension = `.${items[0].type.replace(/^image\//, '')}`;

    const isSingleFileDragged = items.length === 1;
    const isValidFileExtension = allowedFileExtensions.includes(draggedFileExtension);

    if (isSingleFileDragged && isValidFileExtension) {
      isDropZoneActive.value = true;
    }
  }
}
function onDropZoneLeave(e) {
  if (e.dropZoneElement.id === 'dropzone-external') {
    isDropZoneActive.value = false;
  }
}
function onUploaded({ file }) {
  const fileReader = new FileReader();

  fileReader.onload = () => {
    isDropZoneActive.value = false;
    imageSource.value = fileReader.result as string;
  };

  fileReader.readAsDataURL(file);
  textVisible.value = false;
  progressVisible.value = false;
  progressValue.value = 0;
}
function onProgress(e) {
  progressValue.value = (e.bytesLoaded / e.bytesTotal) * 100;
}
function onUploadStarted() {
  imageSource.value = '';
  progressVisible.value = true;
}
</script>
<style>
#dropzone-external {
  width: 350px;
  height: 350px;
  background-color: rgb(183 183 183 / 10%);
  border-width: 2px;
  border-style: dashed;
  padding: 10px;
  border-color: var(--dx-color-border);
}

#dropzone-external > * {
  pointer-events: none;
}

#dropzone-external.dropzone-active {
  border-style: solid;
  border-color: var(--dx-color-primary);
}

.widget-container > span {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
}

#dropzone-image {
  max-width: 100%;
  max-height: 100%;
}

#dropzone-text > span {
  font-weight: 100;
  opacity: 0.5;
}

#upload-progress {
  display: flex;
  margin-top: 10px;
}

.flex-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
