<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        :allow-hiding="false"
        data-field="Full_Name"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        data-field="State"
      />
      <DxColumn
        data-field="Mobile_Phone"
      />
      <DxColumn
        :visible="false"
        data-field="Email"
      />
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
      <DxColumn
        :visible="false"
        data-field="Skype"
      />
      <DxColumnChooser
        :enabled="true"
        :allow-search="allowSearch"
        :mode="mode"
      />
    </DxTreeList>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Column chooser mode </span>
        <DxSelectBox
          :items="columnChooserModes"
          v-model:value="mode"
          value-expr="key"
          display-expr="name"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowSearch"
          text="Allow search"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxColumn, DxColumnChooser } from 'devextreme-vue/tree-list';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxCheckBox } from 'devextreme-vue/check-box';

export default {
  components: {
    DxTreeList, DxColumn, DxColumnChooser,
    DxSelectBox,
    DxCheckBox
  },
  data() {
    return {
      employees: employees,
      columnChooserModes: [{
        key: 'dragAndDrop',
        name: 'Drag and drop'
      }, {
        key: 'select',
        name: 'Select'
      }],
      mode: 'dragAndDrop',
      allowSearch: true,
      expandedRowKeys: [1]
    };
  }
};
</script>
<style scoped>
#employees {
    max-height: 440px;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.option > span {
    margin-right: 10px;
}

.option > .dx-selectbox {
    display: inline-block;
    vertical-align: middle;
}
</style>
