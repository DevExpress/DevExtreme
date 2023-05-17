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
      <div class="dx-field">
        <DxCheckBox
          v-model:value="autoResizeEnabled"
          text="Enable auto resize"
          @value-changed="onAutoResizeChanged"
        />
      </div>
    </div>
    <div class="left-content">
      <DxTextArea
        v-model:height="height"
        :max-length="maxLength"
        :input-attr="{ 'aria-label': 'Notes' }"
        v-model:value="value"
        v-model:auto-resize-enabled="autoResizeEnabled"
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
        :input-attr="{ 'aria-label': 'Notes' }"
        v-model:value="valueForEditableTextArea"
        :value-change-event="eventValue"
      />
      <DxTextArea
        :height="90"
        :read-only="true"
        :value="valueForEditableTextArea"
        :input-attr="{ 'aria-label': 'Notes' }"
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
    DxSelectBox,
  },
  data() {
    return {
      eventValue: service.valueChangeEvents[0].name,
      maxLength: null,
      value: service.getContent(),
      valueForEditableTextArea: service.getContent(),
      valueChangeEvents: service.valueChangeEvents,
      autoResizeEnabled: false,
      height: 90,
    };
  },
  methods: {
    onCheckboxValueChanged(e) {
      const str = service.getContent();
      this.value = e.value ? str.substring(0, 100) : str;
      this.maxLength = e.value ? 100 : null;
    },
    onAutoResizeChanged(e) {
      this.height = e.value ? undefined : 90;
    },
  },
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
