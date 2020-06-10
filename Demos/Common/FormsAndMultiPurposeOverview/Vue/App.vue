<template>
  <DxForm :form-data="formData">
    <template #avatar-template="{}">
      <div class="form-avatar"/>
    </template>
    <DxGroupItem
      :col-count="4"
      css-class="first-group"
    >
      <DxSimpleItem template="avatar-template"/>
      <DxGroupItem :col-span="3">
        <DxSimpleItem data-field="FirstName"/>
        <DxSimpleItem data-field="LastName"/>
        <DxSimpleItem
          :editor-options="birthDateOptions"
          data-field="BirthDate"
          editor-type="dxDateBox"
        />
      </DxGroupItem>
    </DxGroupItem>
    <DxGroupItem
      :col-count="2"
      css-class="second-group"
    >
      <DxGroupItem>
        <DxSimpleItem data-field="Address"/>
        <DxSimpleItem data-field="City"/>
        <DxSimpleItem
          :editor-options="positionOptions"
          data-field="Position"
          editor-type="dxSelectBox"
        />
      </DxGroupItem>
      <DxGroupItem>
        <DxSimpleItem
          :editor-options="stateOptions"
          data-field="State"
          editor-type="dxSelectBox"
        />
        <DxSimpleItem data-field="ZipCode"/>
        <DxSimpleItem
          :editor-options="phoneOptions"
          data-field="Mobile"
        >
          <DxLabel text="Phone"/>
        </DxSimpleItem>
      </DxGroupItem>
      <DxSimpleItem
        :col-span="2"
        :editor-options="notesOptions"
        data-field="Notes"
        editor-type="dxTextArea"
      />
    </DxGroupItem>
  </DxForm>
</template>
<script>
import {
  DxForm,
  DxSimpleItem,
  DxGroupItem,
  DxLabel
} from 'devextreme-vue/form';
import { DxTextArea } from 'devextreme-vue/text-area';
import { employee, positions, states } from './data.js';

export default {
  components: {
    DxForm,
    DxTextArea,
    DxGroupItem,
    DxSimpleItem,
    DxLabel
  },
  data: function() {
    return {
      formData: employee,
      birthDateOptions: { width: '100%' },
      positionOptions: {
        items: positions,
        value: ''
      },
      stateOptions: {
        items: states
      },
      phoneOptions: { mask: '+1 (000) 000-0000' },
      notesOptions: { height: 140 }
    };
  }
};
</script>
<style>
.first-group,
.second-group {
  padding: 20px;
}
.second-group {
  background-color: rgba(191, 191, 191, 0.15);
}
.form-avatar {
  height: 128px;
  width: 128px;
  margin-right: 10px;
  border: 1px solid #d2d3d5;
  border-radius: 50%;
  background-image: url("../../../../images/petersmith.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
