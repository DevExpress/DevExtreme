<template>
  <form
    id="form"
    :ref="formRefName"
    method="post"
    action=""
    enctype="multipart/form-data"
  >
    <h3>Profile Settings</h3>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">First Name:</div>
        <DxTextBox
          value="John"
          :input-attr="{ 'aria-label': 'Full Name' }"
          name="FirstName"
          class="dx-field-value"
        />
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Last Name:</div>
        <DxTextBox
          name="LastName"
          :input-attr="{ 'aria-label': 'Last Name' }"
          value="Smith"
          class="dx-field-value"
        />
      </div>
    </div>
    <div class="fileuploader-container">
      <DxFileUploader
        select-button-text="Select photo"
        label-text=""
        accept="image/*"
        upload-mode="useForm"
      />
    </div>
    <DxButton
      class="button"
      text="Update profile"
      type="success"
      @click="onButtonClick"
    />
  </form>
</template>
<script>
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxTextBox } from 'devextreme-vue/text-box';
import { DxButton } from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxFileUploader,
    DxTextBox,
    DxButton,
  },
  data() {
    return {
      formRefName: 'tree-view',
    };
  },
  methods: {
    onButtonClick() {
      notify('Uncomment the line to enable sending a form to the server.');
      // const form = this.$refs[this.formRefName];
      // form.submit();
    },
  },
};
</script>
<style>
#form {
  max-width: 600px;
  margin: auto;
}

.button {
  margin-top: 50px;
  margin-right: 20px;
  float: right;
}

.fileuploader-container {
  border: 1px solid #d3d3d3;
  margin: 20px 20px 0 20px;
}

#form h3 {
  margin-left: 20px;
  font-weight: normal;
  font-size: 22px;
}
</style>
