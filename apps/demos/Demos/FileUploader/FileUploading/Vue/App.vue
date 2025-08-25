<template>
  <div>
    <div class="widget-container">
      <DxFileUploader
        :accept="accept"
        :multiple="multiple"
        :upload-mode="uploadMode"
        upload-url="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        @value-changed="onValueChanged"
      />
      <div
        :style="{display: files.length > 0 ? 'block' : 'none'}"
        class="content"
      >
        <div>
          <h4>Selected Files</h4>
          <div
            v-for="(file, index) in files"
            :key="index"
            class="selected-item"
          >
            <span>Name: {{ file.name }}<br></span>
            <span>Size {{ file.size }}<br></span>
            <span>Type {{ file.type }}<br></span>
            <span>Last Modified Date: {{ file.lastModified }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="options-panel">
      <div class="caption">Options</div>
      <div class="option">
        <span>File types</span>
        <DxSelectBox
          :data-source="fileTypesSource"
          value-expr="value"
          :input-attr="{ 'aria-label': 'File Type' }"
          display-expr="name"
          value="*"
          @value-changed="onFileTypeChanged"
        />
      </div>
      <div class="option">
        <span>Upload mode</span>
        <DxSelectBox
          :items="['instantly', 'useButtons']"
          value="instantly"
          :input-attr="{ 'aria-label': 'Mode' }"
          @value-changed="onUploadModeChanged"
        />
      </div>
      <div class="option">
        <DxCheckBox
          text="Allow multiple files selection"
          @value-changed="onMultipleChanged"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxFileUploader, type DxFileUploaderTypes } from 'devextreme-vue/file-uploader';
import { DxCheckBox, type DxCheckBoxTypes } from 'devextreme-vue/check-box';
import { DxSelectBox, type DxSelectBoxTypes } from 'devextreme-vue/select-box';

const multiple = ref(false);
const accept = ref('*');
const uploadMode = ref<DxFileUploaderTypes.FileUploadMode>('instantly');
const fileTypesSource = [
  { name: 'All types', value: '*' },
  { name: 'Images', value: 'image/*' },
  { name: 'Videos', value: 'video/*' },
];
const files = ref<File[]>([]);

function onValueChanged(e: DxFileUploaderTypes.ValueChangedEvent) {
  files.value = e.value || [];
}

function onFileTypeChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
  accept.value = e.value;
}

function onUploadModeChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
  uploadMode.value = e.value;
}

function onMultipleChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
  multiple.value = e.value;
}
</script>
<style>
.widget-container {
  margin-right: 320px;
}

.content h4 {
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 18px;
}

.content {
  margin-top: 50px;
  margin-left: 10px;
  display: none;
}

.selected-item {
  margin-bottom: 20px;
}

.options-panel {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 260px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}
</style>
