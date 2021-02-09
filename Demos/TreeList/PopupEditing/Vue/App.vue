<template>
  <div id="tree-list-demo">
    <DxTreeList
      id="employees"
      :data-source="employees"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
      @editor-preparing="onEditorPreparing"
      @init-new-row="onInitNewRow"
    >
      <DxEditing
        :allow-updating="true"
        :allow-deleting="true"
        :allow-adding="true"
        :popup="popupOptions"
        mode="popup"
      />
      <DxColumn
        data-field="Full_Name"
      >
        <DxValidationRule
          type="required"
        />
      </DxColumn>
      <DxColumn
        data-field="Prefix"
        caption="Title"
      >
        <DxValidationRule
          type="required"
        />
      </DxColumn>
      <DxColumn
        :visible="false"
        data-field="Head_ID"
        caption="Head"
      >
        <DxLookup
          :data-source="lookupData"
          value-expr="ID"
          display-expr="Full_Name"
        />
        <DxValidationRule
          type="required"
        />
      </DxColumn>
      <DxColumn
        data-field="Title"
        caption="Position"
      >
        <DxValidationRule
          type="required"
        />
      </DxColumn>
      <DxColumn
        :width="150"
        data-field="City"
      >
        <DxValidationRule
          type="required"
        />
      </DxColumn>
      <DxColumn
        :width="120"
        data-field="Hire_Date"
        data-type="date"
      >
        <DxValidationRule
          type="required"
        />
      </DxColumn>
      <DxColumn type="buttons">
        <DxButton name="edit"/>
        <DxButton name="delete"/>
      </DxColumn>
    </DxTreeList>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxEditing, DxColumn, DxValidationRule, DxLookup, DxButton } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxEditing, DxColumn, DxValidationRule, DxLookup, DxButton
  },
  data() {
    return {
      employees: employees,
      expandedRowKeys: [1],
      popupOptions: {
        title: 'Employee Info',
        showTitle: true,
        width: 700
      },
      lookupData: {
        store: employees,
        sort: 'Full_Name'
      }
    };
  },
  methods: {
    onEditorPreparing(e) {
      if(e.dataField === 'Head_ID' && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },
    onInitNewRow(e) {
      e.data.Head_ID = 1;
    }
  }
};
</script>
<style scoped>
#tree-list-demo {
  min-height: 530px;
}

#employees {
  max-height: 530px;
}
</style>
