<template>
  <div>
    <DxTreeList
      id="treelist"
      :data-source="dataSource"
      :show-borders="true"
      key-expr="id"
      parent-id-expr="parentId"
      has-items-expr="hasItems"
      root-value=""
    >
      <DxRemoteOperations
        :filtering="true"
      />
      <DxColumn
        data-field="name"
      />
      <DxColumn
        :width="100"
        :customize-text="customizeText"
        data-field="size"
      />
      <DxColumn
        :width="150"
        data-field="createdDate"
        data-type="date"
      />
      <DxColumn
        :width="150"
        data-field="modifiedDate"
        data-type="date"
      />
    </DxTreeList>
  </div>
</template>
<script setup lang="ts">
import {
  DxTreeList, DxRemoteOperations, DxColumn, type DxTreeListTypes,
} from 'devextreme-vue/tree-list';
import { type LoadOptions } from 'devextreme-vue/common/data';
import 'whatwg-fetch';

const dataSource = {
  load(loadOptions: LoadOptions) {
    const parentIdsParam = loadOptions.parentIds;
    const url = new URL('https://js.devexpress.com/Demos/NetCore/api/treeListData');
    if (parentIdsParam) {
      parentIdsParam.forEach((id: string) => {
        url.searchParams.append('parentIds', id);
      });
    }

    return fetch(url.toString())
      .then((response) => response.json())
      .catch(() => { throw new Error('Data Loading Error'); });
  },
};

function customizeText({ value }: DxTreeListTypes.ColumnCustomizeTextArg) {
  return value ? `${Math.ceil(value / 1024)} KB` : '';
}
</script>
<style scoped>
#treelist {
  max-height: 440px;
}
</style>
