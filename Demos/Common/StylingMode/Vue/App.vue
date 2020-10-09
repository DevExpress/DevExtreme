<template>
  <div>
    <div class="title">Edit Task</div>
    <div class="editors">
      <div class="left">
        <DxTextBox
          :styling-mode="stylingMode"
          value="Samantha Bright"
          width="100%"
          placeholder="Owner"
        />
        <DxTextBox
          :styling-mode="stylingMode"
          value=""
          width="100%"
          placeholder="Subject"
        >
          <DxValidator
            :validation-rules="[{ type: 'required' }]"
          />
        </DxTextBox>
      </div>
      <div class="right">
        <DxDateBox
          v-model:value="date"
          :styling-mode="stylingMode"
          width="100%"
          placeholder="Start Date"
        />
        <DxSelectBox
          :items="[ 'High', 'Urgent', 'Normal', 'Low' ]"
          :styling-mode="stylingMode"
          value="High"
          width="100%"
          placeholder="Priority"
        />
      </div>
      <div class="center">
        <DxTagBox
          :items="[ 'Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed' ]"
          :value="[ 'Not Started' ]"
          :multiline="false"
          :styling-mode="stylingMode"
          width="100%"
          placeholder="Status"
        />
        <DxTextArea
          :styling-mode="stylingMode"
          value="Need sign-off on the new NDA agreement. It\'s important that this is done quickly to prevent any unauthorized leaks."
          width="100%"
          placeholder="Details"
        />
      </div>
      <div class="center">
        <DxButton
          :on-click="validateClick"
          text="Save"
          type="default"
          class="validate"
        />
      </div>
    </div>
    <div class="options">
      <div class="caption">Styling Mode</div>
      <div class="option">
        <DxSelectBox
          :items="[ 'outlined', 'filled', 'underlined' ]"
          v-model:value="stylingMode"
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
import DxValidator from 'devextreme-vue/validator';
import validationEngine from 'devextreme/ui/validation_engine';
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxSelectBox,
    DxTextBox,
    DxTextArea,
    DxTagBox,
    DxDateBox,
    DxButton,
    DxValidator
  },
  data() {
    setTimeout(() => validationEngine.validateGroup());
    return {
      date: new Date(2020, 4, 3),
      stylingMode: 'filled'
    };
  },
  methods: {
    validateClick(e) {
      var result = e.validationGroup.validate();
      if (result.isValid) {
        notify('The task was saved successfully.', 'success');
      } else {
        notify('The task was not saved. Please check if all fields are valid.', 'error');
      }
    }
  }
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
}

.editors .left, .editors .right {
    display: inline-block;
    width: 49%;
    padding-right: 20px;
    box-sizing: border-box;
}

.editors .left {
    margin-right: 4px;
}

.editors .left > *, .editors .right > *, .editors .center > * {
    margin-bottom: 20px;
}

.editors .center {
    padding: 20px 27px 0 0;
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
</style>
