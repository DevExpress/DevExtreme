<template>
  <div class="list-container">
    <DxList
      :data-source="dataSource"
      :grouped="true"
      :collapsible-groups="true"
      height="100%"
    >
      <template #group="{ data: item }">
        <div>Assigned: {{ item.key }}</div>
      </template>
    </DxList>
  </div>
</template>
<script>
import DxList from 'devextreme-vue/list';

import { employees } from './data.js';

export default {
  components: {
    DxList
  },
  data() {
    return {
      dataSource: employees
    };
  }
};
</script>
<style>
.list-container {
    min-height: 440px;
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
}
</style>
