<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxNodes
      :data-source="dataSource"
      :key-expr="'ID'"
      :text-expr="'Title'"
      :parent-key-expr="'HeadID'"
    >
      <DxAutoLayout :type="'tree'"/>
    </DxNodes>
    <DxContextToolbox
      :shape-icons-per-row="2"
      :width="100"
      :shapes="['rectangle']"
    />
    <DxToolbox
      :show-search="false"
      :shape-icons-per-row="2"
    >
      <DxGroup
        :title="'Items'"
        :shapes="['rectangle']"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script>
import { DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxContextToolbox, DxGroup } from 'devextreme-vue/diagram';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DiagramEmployees';

const dataSource = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  insertUrl: `${url}/InsertEmployee`,
  updateUrl: `${url}/UpdateEmployee`,
  deleteUrl: `${url}/DeleteEmployee`,
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
  onInserting: function(values) {
    values['ID'] = 0;
    values['Title'] = values['Title'] || 'New Position';
    values['Prefix'] = 'Mr';
    values['FullName'] = 'New Employee';
    values['City'] = 'LA';
    values['State'] = 'CA';
    values['HireDate'] = new Date();
  }
});

export default {
  components: {
    DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxContextToolbox, DxGroup
  },
  data() {
    return {
      dataSource: dataSource
    };
  }
};
</script>
<style scoped>
    #diagram {
        height: 725px;
    }
</style>
