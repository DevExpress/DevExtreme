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
              :input-attr="{ 'aria-label': 'Event' }"
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
<script setup lang="ts">
import { ref } from 'vue';
import DxTextArea from 'devextreme-vue/text-area';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import service from './data.js';

const eventValue = ref(service.valueChangeEvents[0].name);
const maxLength = ref(null);
const value = ref(service.getContent());
const valueForEditableTextArea = ref(service.getContent());
const valueChangeEvents = service.valueChangeEvents;
const autoResizeEnabled = ref(false);
const height = ref(90);

function onCheckboxValueChanged(e) {
  const str = service.getContent();
  value.value = e.value ? str.substring(0, 100) : str;
  maxLength.value = e.value ? 100 : null;
}

function onAutoResizeChanged(e) {
  height.value = e.value ? undefined : 90;
}
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
