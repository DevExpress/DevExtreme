<template>
  <div>
    <div class="widget-container">
      <DxFileUploader
        :accept="accept"
        :multiple="multiple"
        :upload-mode="uploadMode"
        upload-url="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        @value-changed="e => files = e.value"
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
            <span>Type {{ file.size }}<br></span>
            <span>Last Modified Date: {{ file.lastModifiedDate }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>File types</span>
        <DxSelectBox
          :data-source="fileTypesSource"
          value-expr="value"
          display-expr="name"
          value="*"
          @value-changed="e => accept = e.value"
        />
      </div>
      <div class="option">
        <span>Upload mode</span>
        <DxSelectBox
          :items="['instantly', 'useButtons']"
          value="instantly"
          @value-changed="e => uploadMode = e.value"
        />
      </div>
      <div class="option">
        <DxCheckBox
          text="Allow multiple files selection"
          @value-changed="e => multiple = e.value"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxSelectBox } from 'devextreme-vue/select-box';

export default {
  components: {
    DxFileUploader,
    DxSelectBox,
    DxCheckBox
  },
  data() {
    return {
      multiple: false,
      accept: '*',
      uploadMode: 'instantly',
      fileTypesSource: [
        { name: 'All types', value: '*' },
        { name: 'Images', value: 'image/*' },
        { name: 'Videos', value: 'video/*' }
      ],
      files: []
    };
  }
};
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

.options {
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
