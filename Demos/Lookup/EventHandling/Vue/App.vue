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
<script>
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { employees } from './data.js';

export default {
  components: {
    DxLookup,
    DxDropDownOptions,
    DxSelectBox,
  },
  data() {
    return {
      items: employees,
      selectedValue: null,
      applyValueModes: ['instantly', 'useButtons'],
      applyValueMode: 'instantly',
    };
  },
  methods: {
    getDisplayExpr(item) {
      return item ? `${item.FirstName} ${item.LastName}` : '';
    },
    setSelectedValue(e) {
      this.selectedValue = e.value;
    },
  },
};
</script>

