<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Custom Field Template</div>
      <div class="dx-field">
        <DxLookup
          v-model:value="lookupValue"
          :items="employees"
          :display-expr="getDisplayExpr"
          class="field-customization"
          value-expr="ID"
          field-template="field-item"
          :input-attr="{ 'aria-label': 'Custom Field Template' }"
        >
          <DxDropDownOptions title="Select employee"/>
          <template #field-item="{ data }">
            <FieldItem :item-data="data"/>
          </template>
        </DxLookup>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Custom Item Template</div>
      <div class="dx-field">
        <DxLookup
          :items="employees"
          :search-expr="['FirstName', 'LastName', 'Prefix']"
          :display-expr="getDisplayExpr"
          value-expr="ID"
          placeholder="Select employee"
          item-template="list-item"
          :input-attr="{ 'aria-label': 'Custom Item Template' }"
        >
          <DxDropDownOptions title="Select employee"/>
          <template #list-item="{ data }">
            <ListItem :item-data="data"/>
          </template>
        </DxLookup>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
import FieldItem from './FieldItem.vue';
import ListItem from './ListItem.vue';
import { employees } from './data.ts';

const lookupValue = ref(employees[0].ID);

const getDisplayExpr = ({ FirstName = '', LastName = '' } = {}) => `${FirstName} ${LastName}`.trim();
</script>
<style scoped>
  .field-customization {
    min-height: 32px;
  }

  .dx-lookup {
    height: 36px;
  }

  .dx-theme-material .dx-lookup {
    height: 48px;
  }

  .dx-lookup.field-customization .dx-lookup-field {
    padding: 2px 5px;
  }

  .dx-theme-material .dx-lookup.field-customization .dx-lookup-field {
    padding: 6px 5px;
  }

  .dx-viewport .dx-fieldset {
    width: 40%;
    float: left;
  }

  .dx-field > .dx-lookup {
    flex: 1;
  }
</style>
