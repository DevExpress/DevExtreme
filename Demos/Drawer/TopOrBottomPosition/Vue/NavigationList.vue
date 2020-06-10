<template>
  <div>
    <DxList
      :data-source="navigation"
      :active-state-enabled="false"
      :hover-state-enabled="false"
      :focus-state-enabled="false"
      class="panel-list dx-theme-accent-as-background-color"
    />
  </div>
</template>
<script>

import { DxList } from 'devextreme-vue/list';
import { navigation } from './data.js';

export default {
  components: {
    DxList
  },
  data() {
    return {
      navigation
    };
  }
};
</script>
