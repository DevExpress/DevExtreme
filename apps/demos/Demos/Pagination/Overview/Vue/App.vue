<template>
  <DxPagination
    :show-info="showInfo"
    :show-navigation-buttons="showPageSizeSelector"
    :allowed-page-sizes="pageSizes"
    :page-index="pageIndex"
    :page-size="pageSize"
    :item-count="itemCount"
    @option-changed="handlePropertyChange"
  />
</template>
<script>

import { computed, ref } from 'vue';
import DxPagination from 'devextreme-vue/pagination';
import { employees } from './data.ts';

const pageSizes = [4, 6];
const showInfo = true;
const showPageSizeSelector = true;
let pageIndex = 1;
let pageSize = 4;
const itemCount = employees.length;

export default {
  components: {
    DxPagination,
  },
  data() {
    return {
      showInfo,
      showPageSizeSelector,
      pageSizes,
      pageIndex,
      pageSize,
      itemCount,
    };
  },
  methods: {
    handlePropertyChange(e) {
      
    }
  }
};
</script>
