<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Checked</div>
        <div class="dx-field-value">
          <DxCheckBox
            :value="true"
            :element-attr="checkedLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Unchecked</div>
        <div class="dx-field-value">
          <DxCheckBox
            :value="false"
            :element-attr="unCheckedLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Indeterminate</div>
        <div class="dx-field-value">
          <DxCheckBox
            :value="null"
            :element-attr="indeterminateLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Three state mode</div>
        <div class="dx-field-value">
          <DxCheckBox
            :enable-three-state-behavior="true"
            :value="null"
            :element-attr="threeStateModeLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Handle value change</div>
        <div class="dx-field-value">
          <DxCheckBox
            v-model:value="checkBoxValue"
            :element-attr="handleValueChangeLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxCheckBox
            :disabled="true"
            :value="checkBoxValue"
            :element-attr="disabledLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Custom size</div>
        <div class="dx-field-value">
          <DxCheckBox
            :value="null"
            :icon-size="30"
            :element-attr="customSizeLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With label</div>
        <div class="dx-field-value">
          <DxCheckBox
            text="Label"
            :value="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxCheckBox } from 'devextreme-vue/check-box';

const checkBoxValue = ref(null);

const checkedLabel = { 'aria-label': 'Checked' };
const unCheckedLabel = { 'aria-label': 'Unchecked' };
const indeterminateLabel = { 'aria-label': 'Indeterminate' };
const threeStateModeLabel = { 'aria-label': 'Three state mode' };
const handleValueChangeLabel = { 'aria-label': 'Handle value change' };
const disabledLabel = { 'aria-label': 'Disabled' };
const customSizeLabel = { 'aria-label': 'Custom size' };
</script>
