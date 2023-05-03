<template>
  <div>
    <div id="tree-list-demo">
      <DxTreeList
        id="employees"
        :data-source="employees"
        :show-row-lines="true"
        :show-borders="true"
        :column-auto-width="true"
        :expanded-row-keys="expandedRowKeys"
        key-expr="ID"
        parent-id-expr="Head_ID"
        @editor-preparing="onEditorPreparing"
        @init-new-row="onInitNewRow"
      >
        <DxEditing
          :allow-updating="true"
          :allow-deleting="allowDeleting"
          :allow-adding="true"
          mode="row"
        />
        <DxColumn
          data-field="Full_Name"
        >
          <DxRequiredRule/>
        </DxColumn>
        <DxColumn
          data-field="Head_ID"
          caption="Head"
        >
          <DxLookup
            :data-source="dataSource"
            value-expr="ID"
            display-expr="Full_Name"
          />
          <DxRequiredRule/>
        </DxColumn>
        <DxColumn
          data-field="Title"
          caption="Position"
        >
          <DxRequiredRule/>
        </DxColumn>
        <DxColumn
          :width="120"
          data-field="Hire_Date"
          data-type="date"
        >
          <DxRequiredRule/>
        </DxColumn>
        <DxColumn type="buttons">
          <DxButton name="edit"/>
          <DxButton name="delete"/>
        </DxColumn>
      </DxTreeList>
    </div>
  </div>
</template>
<script>
import {
  DxTreeList, DxEditing, DxColumn, DxRequiredRule, DxLookup, DxButton,
} from 'devextreme-vue/tree-list';
import { employees } from './data.js';

export default {
  components: {
    DxTreeList, DxEditing, DxColumn, DxRequiredRule, DxLookup, DxButton,
  },
  data() {
    return {
      employees,
      expandedRowKeys: [1, 2, 3, 4, 5],
      dataSource: {
        store: employees,
        sort: 'Full_Name',
      },
    };
  },
  methods: {
    onEditorPreparing(e) {
      if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
        e.cancel = true;
      }
    },
    onInitNewRow(e) {
      e.data.Head_ID = 1;
    },
    allowDeleting(e) {
      return e.row.data.ID !== 1;
    },
  },
};
</script>
<style scoped>
#tree-list-demo {
  min-height: 700px;
}

#employees {
  max-height: 700px;
}
</style>
