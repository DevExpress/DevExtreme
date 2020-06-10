<template>
  <div>
    <DxFileUploader
      :chunk-size="200000"
      name="file"
      accept="image/*"
      upload-url="https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/ChunkUpload"
      @upload-started="() => chunks = []"
      @progress="onUploadProgress($event)"
    />
    <span class="note">Allowed file extensions: <span>.jpg, .jpeg, .gif, .png</span>.</span>
    <span class="note">Maximum file size: <span>4 MB.</span></span>
    <div class="chunk-panel">
      <div
        v-for="(chunk, index) in chunks"
        :key="index"
      >
        <span>Chunk size:</span>
        <span class="segment-size dx-theme-accent-as-text-color">{{ getValueInKb(chunk.segmentSize) }}</span>
        <span>, Uploaded:'</span>
        <span class="loaded-size dx-theme-accent-as-text-color">{{ getValueInKb(chunk.bytesLoaded) }}</span>
        <span>/</span>
        <span class="total-size dx-theme-accent-as-text-color">{{ getValueInKb(chunk.bytesTotal) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import DxFileUploader from 'devextreme-vue/file-uploader';

export default {
  components: {
    DxFileUploader
  },
  data() {
    return {
      chunks: []
    };
  },
  methods: {
    getValueInKb(value) {
      return `${(value / 1024).toFixed(0)}kb`;
    },
    onUploadProgress(e) {
      this.chunks.push({
        segmentSize: e.segmentSize,
        bytesLoaded: e.bytesLoaded,
        bytesTotal: e.bytesTotal
      });
    }
  }
};
</script>
<style>
.chunk-panel {
    width: 505px;
    height: 165px;
    overflow-y: auto;
    padding: 18px;
    margin-top: 40px;
    background-color: rgba(191, 191, 191, 0.15);
}

.segment-size,
.loaded-size {
    margin-left: 3px;
}

.note {
    display: block;
    font-size: 10pt;
    color: #484848;
    margin-left: 9px;
}
.note > span {
    font-weight: 700
}
</style>
