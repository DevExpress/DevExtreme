<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Simple lookup</div>
      <div class="dx-field">
        <DxLookup
          :items="employeesList"
          :value="employeesList[0]"
          :input-attr="{ 'aria-label': 'Simple lookup' }"
        >
          <DxDropDownOptions :show-title="false"/>
        </DxLookup>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Grouped lookup</div>
      <div class="dx-field">
        <DxLookup
          :data-source="dataSource"
          :grouped="true"
          :input-attr="{ 'aria-label': 'Grouped lookup' }"
          display-expr="Subject"
        >
          <DxDropDownOptions
            :hide-on-outside-click="true"
            :show-title="false"
          />
        </DxLookup>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
import DataSource from 'devextreme/data/data_source';
import { employeesList, employeesTasks } from './data.js';

const dataSource = new DataSource({
  store: employeesTasks,
  key: 'ID',
  group: 'Assigned',
});
</script>

