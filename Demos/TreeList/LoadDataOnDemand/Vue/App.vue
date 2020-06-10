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
<script>
import { DxTreeList, DxRemoteOperations, DxColumn } from 'devextreme-vue/tree-list';
import 'whatwg-fetch';

export default {
  components: {
    DxTreeList, DxRemoteOperations, DxColumn
  },
  data() {
    return {
      dataSource: {
        load: function(loadOptions) {
          let parentIdsParam = loadOptions.parentIds;

          return fetch(`https://js.devexpress.com/Demos/Mvc/api/treeListData?parentIds=${parentIdsParam}`)
            .then(response => response.json())
            .catch(() => { throw 'Data Loading Error'; });
        }
      }
    };
  },
  methods: {
    customizeText(e) {
      if(e.value !== null) {
        return `${Math.ceil(e.value / 1024) } KB`;
      }
    }
  }
};

</script>
<style scoped>
#treelist {
    max-height: 440px;
}
</style>
