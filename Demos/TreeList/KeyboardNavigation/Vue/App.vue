<template>
  <DxTreeList
    :data-source="dataSource"
    :columns="columns"
    :show-borders="true"
    :focused-row-enabled="true"
    :expanded-row-keys="[1, 2, 3, 5]"
    key-expr="ID"
    parent-id-expr="Head_ID"
  >
    <DxEditing
      :allow-updating="true"
      :allow-deleting="true"
      :select-text-on-edit-start="true"
      :use-icons="true"
    />
    <DxHeaderFilter :visible="true"/>
    <DxFilterRow :visible="true"/>
    <DxFilterPanel :visible="true"/>
    <DxScrolling mode="standard"/>
    <DxPager
      :allowed-page-sizes="[5, 10]"
      :show-page-size-selector="true"
      :show-navigation-buttons="true"
    />
    <DxPaging
      :enabled="true"
      :page-size="10"
    />
  </DxTreeList>
</template>
<script>

import {
  DxTreeList,
  DxEditing,
  DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  DxScrolling,
  DxPager,
  DxPaging
} from 'devextreme-vue/tree-list';
import { employees } from './data.js';

export default {
  components: {
    DxTreeList,
    DxEditing,
    DxHeaderFilter,
    DxFilterRow,
    DxFilterPanel,
    DxScrolling,
    DxPager,
    DxPaging
  },
  data() {
    return {
      dataSource: employees,
      columns: [
        'Full_Name',
        {
          dataField: 'Title',
          caption: 'Position'
        },
        'City',
        'State'
      ]
    };
  }
};
</script>
