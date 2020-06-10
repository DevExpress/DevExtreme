<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <DxLookup
          :items="items"
          :display-expr="getDisplayExpr"
          placeholder="Select employee"
          @value-changed="setSelectedValue"
        >
          <DxDropDownOptions :show-title="false"/>
        </DxLookup>
      </div>
    </div>
    <div v-if="selectedValue">
      <div class="selected">
        <img
          id="selected-employee-img"
          :src="selectedValue.Picture"
        >
        <span id="selected-employee-notes">{{ selectedValue.Notes }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
import { employees } from './data.js';

export default {
  components: {
    DxLookup,
    DxDropDownOptions
  },
  data() {
    return {
      items: employees,
      selectedValue: null
    };
  },
  methods: {
    getDisplayExpr(item) {
      return item ? `${item.FirstName} ${item.LastName}` : '';
    },
    setSelectedValue(e) {
      this.selectedValue = e.value;
    }
  }
};
</script>

