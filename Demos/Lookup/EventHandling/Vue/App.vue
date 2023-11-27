<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <DxLookup
          :items="items"
          :display-expr="getDisplayExpr"
          :apply-value-mode="applyValueMode"
          placeholder="Select employee"
          :input-attr="{ 'aria-label': 'Lookup' }"
          @value-changed="setSelectedValue"
        >
          <DxDropDownOptions :show-title="false"/>
        </DxLookup>
      </div>
    </div>
    <div v-if="selectedValue">
      <div class="selected">
        <div class="frame">
          <img
            id="selected-employee-img"
            :src="selectedValue.Picture"
          >
        </div>
        <div id="selected-employee-notes">{{ selectedValue.Notes }}</div>
      </div>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <div class="label">Apply Value Mode</div>
        <DxSelectBox
          :items="applyValueModes"
          :input-attr="{ 'aria-label': 'Apply Value Mode' }"
          v-model:value="applyValueMode"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { employees } from './data.ts';

const items = employees;
const selectedValue = ref(null);
const applyValueModes = ref(['instantly', 'useButtons']);
const applyValueMode = ref('instantly');

const getDisplayExpr = ({ FirstName = '', LastName = '' } = {}) => `${FirstName} ${LastName}`.trim();
function setSelectedValue(e) {
  selectedValue.value = e.value;
}
</script>

