<template>
  <div class="widget-container flex-box">
    <span>Profile Picture</span>
    <div
      id="dropzone-external"
      :class="dropzoneClassObject"
    >
      <img
        ref="dropzoneImage"
        id="dropzone-image"
        :hidden="true"
        alt=""
        @load="toggleImageVisible(true)"
      >
      <div
        id="dropzone-text"
        class="flex-box"
      >
        <span>Drag & Drop the desired file</span>
        <span>…or click to browse for a file instead.</span>
      </div>
      <DxProgressBar
        ref="uploadProgress"
        id="upload-progress"
        :min="0"
        :max="100"
        width="30%"
        :show-status="false"
        :visible="false"
        :value="0"
      />
    </div>
    <DxFileUploader
      id="file-uploader"
      dialog-trigger="#dropzone-external"
      drop-zone="#dropzone-external"
      :multiple="false"
      :allowed-file-extensions="['.jpg', '.jpeg', '.gif', '.png']"
      upload-mode="instantly"
      upload-url="https://js.devexpress.com/Content/Services/upload.aspx"
      :visible="false"
      @drop-zone-enter="onDropZoneEnter"
      @drop-zone-leave="onDropZoneLeave"
      @uploaded="onUploaded"
      @progress="onProgress"
      @upload-started="onUploadStarted"
    />
  </div>
</template>
<script>
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxProgressBar } from 'devextreme-vue/progress-bar';

export default {
  components: {
    DxFileUploader,
    DxProgressBar
  },
  data() {
    return {
      isDropZoneActive: false,
      dropzoneClassObject: {
        'dx-theme-accent-as-border-color': this.isDropZoneActive,
        'dropzone-active': this.isDropZoneActive,
        'dx-theme-border-color': !this.isDropZoneActive,
        'flex-box': true
      }
    };
  },
  mounted() {
    this.dropzoneImage = this.$refs.dropzoneImage;
    this.uploadProgress = this.$refs.uploadProgress.instance;
  },
  methods: {
    onDropZoneEnter(e) {
      if(e.dropZoneElement.id === 'dropzone-external') {
        this.isDropZoneActive = true;
      }
    },
    onDropZoneLeave(e) {
      if(e.dropZoneElement.id === 'dropzone-external') {
        this.isDropZoneActive = false;
      }
    },
    onUploaded(e) {
      const file = e.file;
      const dropZoneText = document.getElementById('dropzone-text');
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.isDropZoneActive = false;
        this.dropzoneImage.src = fileReader.result;
      };
      fileReader.readAsDataURL(file);
      dropZoneText.style.display = 'none';
      this.uploadProgress.option({
        visible: false,
        value: 0
      });
    },
    onProgress(e) {
      this.uploadProgress.option('value', e.bytesLoaded / e.bytesTotal * 100);
    },
    onUploadStarted() {
      this.dropzoneImage.src = '';
      this.toggleImageVisible(false);
      this.uploadProgress.option('visible', true);
    },
    toggleImageVisible(visible) {
      this.dropzoneImage.hidden = !visible;
    }
  }
};
</script>
<style>
#dropzone-external {
	width: 350px;
	height: 350px;
	background-color: rgba(183, 183, 183, 0.1);
	border-width: 2px;
	border-style: dashed;
	padding: 10px;
}
#dropzone-external > * {
	pointer-events: none;
}
#dropzone-external.dropzone-active {
	border-style: solid;
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
