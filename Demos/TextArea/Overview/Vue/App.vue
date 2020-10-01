<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Default Mode</div>
      <div class="dx-field">
        <DxCheckBox
          :value="false"
          text="Limit text length"
          @value-changed="onCheckboxValueChanged"
        />
      </div>
    </div>
    <div class="left-content">
      <DxTextArea
        :height="90"
        :max-length="maxLength"
        v-model:value="value"
      />
    </div>
    <div class="full-width-content">
      <div class="dx-fieldset">
        <div class="dx-fieldset-header">Event Handling and API</div>
        <div class="dx-field">
          <div class="dx-field-label">Synchronize text areas </div>
          <div class="dx-field-value">
            <DxSelectBox
              :items="valueChangeEvents"
              v-model:value="eventValue"
              value-expr="name"
              display-expr="title"
            />
          </div>
        </div>
      </div>
      <DxTextArea
        :height="90"
        v-model:value="valueForEditableTextArea"
        :value-change-event="eventValue"
      />
      <DxTextArea
        :height="90"
        :read-only="true"
        :value="valueForEditableTextArea"
      />
    </div>
  </div>
</template>
<script>
import DxTextArea from 'devextreme-vue/text-area';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';

import service from './data.js';

export default {
  components: {
    DxCheckBox,
    DxTextArea,
    DxSelectBox
  },
  data() {
    return {
      eventValue: service.valueChangeEvents[0].name,
      maxLength: null,
      value: service.getContent(),
      valueForEditableTextArea: service.getContent(),
      valueChangeEvents: service.valueChangeEvents
    };
  },
  methods: {
    onCheckboxValueChanged(e) {
      if (e.value) {
        this.value = service.getContent().substring(0, 100);
        this.maxLength = 100;
      } else {
        this.value = service.getContent();
        this.maxLength = null;
      }
    }
  }
};
</script>
<style>
.full-width-content {
    width: 100%;
    margin-top: 30px;
}

.full-width-content > .dx-widget {
    margin-bottom: 20px;
}

.full-width-content .dx-field {
    max-width: 385px;
}
</style>
