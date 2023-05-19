<template>
  <div>
    <div class="title">Edit Profile</div>
    <div class="editors">
      <div class="editors-container">
        <div class="left">
          <DxTextBox
            :styling-mode="stylingMode"
            :label-mode="labelMode"
            value="Olivia Peyton"
            :input-attr="{ 'aria-label': 'Name' }"
            width="100%"
            placeholder="Type..."
            label="Name"
          >
            <DxValidator>
              <DxRequiredRule/>
            </DxValidator>
          </DxTextBox>
          <DxTextBox
            :styling-mode="stylingMode"
            :label-mode="labelMode"
            :input-attr="{ 'aria-label': 'Address' }"
            width="100%"
            placeholder="Type..."
            label="Address"
          >
            <DxValidator>
              <DxRequiredRule/>
            </DxValidator>
          </DxTextBox>
        </div>
        <div class="right">
          <DxDateBox
            :value="birthDate"
            :styling-mode="stylingMode"
            :label-mode="labelMode"
            :input-attr="{ 'aria-label': 'Birth Date' }"
            width="100%"
            placeholder="Select..."
            label="Birth Date"
          >
            <DxValidator>
              <DxRequiredRule/>
            </DxValidator>
          </DxDateBox>
          <DxSelectBox
            :items="states"
            :input-attr="{ 'aria-label': 'State' }"
            :styling-mode="stylingMode"
            :label-mode="labelMode"
            width="100%"
            placeholder="Select..."
            label="State"
          >
            <DxValidator>
              <DxRequiredRule/>
            </DxValidator>
          </DxSelectBox>
        </div>
      </div>
      <div class="center">
        <DxTagBox
          :items="positions"
          :value="[ 'Support Manager' ]"
          :input-attr="{ 'aria-label': 'Position' }"
          :multiline="false"
          :styling-mode="stylingMode"
          :label-mode="labelMode"
          width="100%"
          placeholder="Select..."
          label="Position"
        >
          <DxValidator>
            <DxRequiredRule/>
          </DxValidator>
        </DxTagBox>
      </div>
      <div class="editors-container">
        <div class="left">
          <DxTextBox
            :styling-mode="stylingMode"
            :label-mode="labelMode"
            :mask-rules="phoneRules"
            :input-attr="{ 'aria-label': 'Phone' }"
            width="100%"
            mask="+1 (000) 000-0000"
            label="Phone"
          >
            <DxValidator>
              <DxRequiredRule/>
            </DxValidator>
          </DxTextBox>
        </div>
        <div class="right">
          <DxDateBox
            :styling-mode="stylingMode"
            :label-mode="labelMode"
            width="100%"
            :input-attr="{ 'aria-label': 'Hire Date' }"
            placeholder="Select..."
            label="Hire Date"
          >
            <DxValidator>
              <DxRequiredRule/>
            </DxValidator>
          </DxDateBox>
        </div>
      </div>
      <div class="center">
        <DxTextArea
          :styling-mode="stylingMode"
          :label-mode="labelMode"
          :value="text"
          :input-attr="{ 'aria-label': 'Notes' }"
          width="100%"
          placeholder="Type..."
          label="Notes"
        />
      </div>
      <div class="center">
        <DxButton
          @click="validateClick"
          text="Save"
          type="default"
          class="validate"
        />
      </div>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <label>Styling Mode</label>
        <DxSelectBox
          :styling-mode="stylingMode"
          :input-attr="{ 'aria-label': 'Styling Mode' }"
          :items="[ 'outlined', 'filled', 'underlined' ]"
          v-model:value="stylingMode"
        />
      </div>
      <div class="option">
        <label>Label Mode</label>
        <DxSelectBox
          :styling-mode="stylingMode"
          :input-attr="{ 'aria-label': 'Label Mode' }"
          :items="[ 'static', 'floating', 'hidden' ]"
          v-model:value="labelMode"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxSelectBox from 'devextreme-vue/select-box';
import DxTextBox from 'devextreme-vue/text-box';
import DxTextArea from 'devextreme-vue/text-area';
import DxTagBox from 'devextreme-vue/tag-box';
import DxDateBox from 'devextreme-vue/date-box';
import DxButton from 'devextreme-vue/button';
import {
  DxValidator,
  DxRequiredRule,
} from 'devextreme-vue/validator';
import notify from 'devextreme/ui/notify';

import service from './data.js';

export default {
  components: {
    DxSelectBox,
    DxTextBox,
    DxTextArea,
    DxTagBox,
    DxDateBox,
    DxButton,
    DxValidator,
    DxRequiredRule,
  },
  data() {
    return {
      birthDate: new Date(1981, 5, 3),
      stylingMode: 'filled',
      labelMode: 'static',
      text: 'Olivia loves to sell. She has been selling DevAV products since 2012.',
      positions: service.getPositions(),
      states: service.getStates(),
      phoneRules: {
        X: /[02-9]/,
      },
    };
  },
  methods: {
    validateClick(e) {
      const result = e.validationGroup.validate();
      if (result.isValid) {
        notify('The task was saved successfully.', 'success');
      } else {
        notify('The task was not saved. Please check if all fields are valid.', 'error');
      }
    },
  },
};
</script>
<style>
.title {
  padding: 20px 0 20px 0;
  font-size: 18px;
  font-weight: 500;
}

.editors {
  margin-right: 320px;
  height: 570px;
}

.editors .left {
  padding: 0 10px 0 0;
}

.editors .right {
  padding: 0 0 0 10px;
}

.editors .left,
.editors .right {
  flex-grow: 1;
}

.editors .left > *,
.editors .right > *,
.editors .center > * {
  margin-bottom: 20px;
}

.editors .center {
  padding: 0 27px 0 0;
}

.validate {
  float: right;
}

.options {
  padding: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 260px;
  top: 0;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 20px;
}

.editors-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 27px;
}
</style>
