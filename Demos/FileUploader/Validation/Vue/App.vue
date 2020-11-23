<template>
  <div class="main-block">
    <div class="file-uploader-block">
      <DxFileUploader
        :multiple="true"
        :allowed-file-extensions="['.jpg', '.jpeg', '.gif', '.png']"
        upload-url="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        upload-mode="useButtons"
      />
      <span class="note">
        Allowed file extensions:
        <span>.jpg, .jpeg, .gif, .png</span>.
      </span>
    </div>
    <div
      class="file-uploader-block"
      style="float: right"
    >
      <DxFileUploader
        :multiple="true"
        :max-file-size="4000000"
        upload-url="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        upload-mode="useButtons"
      />
      <span class="note">
        Maximum file size:
        <span>4 MB</span>.
      </span>
    </div>
  </div>
</template>
<script>
import DxFileUploader from 'devextreme-vue/file-uploader';

export default {
  components: {
    DxFileUploader
  }
};
</script>
<style>
.file-uploader-block {
    width: 350px;
    float: left;
}

.note {
    font-size: 10pt;
    color: #484848;
    margin-left: 9px;
}

.note > span {
    font-weight: 700
}

.main-block {
    max-width: 900px;
    min-width: 700px;
}
</style>
