<template>
  <DxDataGrid
    id="gridContainer"
    :ref="gridRefName"
    :data-source="orders"
    key-expr="ID"
    :show-borders="true"
  >
    <DxGrouping :auto-expand-all="expanded"/>
    <DxColumnChooser :enabled="true"/>
    <DxLoadPanel :enabled="true"/>
    <DxColumn
      data-field="OrderNumber"
      caption="Invoice Number"
    />
    <DxColumn data-field="OrderDate"/>
    <DxColumn data-field="Employee"/>
    <DxColumn
      data-field="CustomerStoreCity"
      caption="City"
    />
    <DxColumn
      :group-index="0"
      data-field="CustomerStoreState"
      caption="State"
    />
    <DxColumn
      data-field="SaleAmount"
      alignment="right"
      format="currency"
    />
    <DxToolbar>
      <DxItem location="before">
        <div class="informer">
          <h2 class="count">{{ totalCount }}</h2>
          <span class="name">Total Count</span>
        </div>
      </DxItem>
      <DxItem location="before">
        <DxSelectBox
          width="200"
          :items="groupingValues"
          display-expr="text"
          value-expr="value"
          value="CustomerStoreState"
          @value-changed="groupChanged"
        />
      </DxItem>
      <DxItem location="before">
        <DxButton
          text="Collapse All"
          width="136"
          @click="collapseAllClick"
        />
      </DxItem>
      <DxItem location="after">
        <DxButton
          icon="refresh"
          @click="refreshDataGrid"
        />
      </DxItem>
      <DxItem
        name="columnChooserButton"
      />
    </DxToolbar>
  </DxDataGrid>
</template>
<script>
import { DxDataGrid, DxColumn, DxGrouping, DxColumnChooser, DxLoadPanel, DxToolbar, DxItem } from 'devextreme-vue/data-grid';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxButton } from 'devextreme-vue/button';
import query from 'devextreme/data/query';
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn, DxGrouping, DxColumnChooser, DxLoadPanel, DxToolbar, DxItem, DxSelectBox, DxButton
  },
  data() {
    return {
      orders: service.getOrders(),
      gridRefName: 'dataGrid',
      expanded: true,
      totalCount: 0,
      groupingValues: [{
        value: 'CustomerStoreState',
        text: 'Grouping by State'
      }, {
        value: 'Employee',
        text: 'Grouping by Employee'
      }],
    };
  },
  created() {
    this.totalCount = this.getGroupCount('CustomerStoreState');
  },
  methods: {
    getGroupCount(groupField) {
      return query(this.orders)
        .groupBy(groupField)
        .toArray().length;
    },
    groupChanged(e) {
      this.$refs[this.gridRefName].instance.clearGrouping();
      this.$refs[this.gridRefName].instance.columnOption(e.value, 'groupIndex', 0);
      this.totalCount = this.getGroupCount(e.value);
    },
    collapseAllClick(e) {
      this.expanded = !this.expanded;
      e.component.option({
        text: this.expanded ? 'Collapse All' : 'Expand All'
      });
    },
    refreshDataGrid() {
      this.$refs[this.gridRefName].instance.refresh();
    }
  }
};
</script>
<style scoped>

.dx-datagrid-header-panel {
    padding: 0;
    background-color: rgba(85, 149, 222, 0.6);
}

.dx-datagrid-header-panel .dx-toolbar {
    margin: 0;
    padding-right: 20px;
    background-color: transparent;
}

.dx-datagrid-header-panel .dx-toolbar-items-container  {
    height: 70px;
}

.dx-datagrid-header-panel .dx-toolbar-before .dx-toolbar-item:not(:first-child) {
    background-color: rgba(103, 171, 255, 0.6);
}

.dx-datagrid-header-panel .dx-toolbar-before .dx-toolbar-item:last-child {
    padding-right: 10px;
}

.dx-datagrid-header-panel .dx-selectbox {
    margin: 17px 10px;
}

.dx-datagrid-header-panel .dx-button {
     margin: 17px 0;
}

.informer {
    height: 70px;
    width: 130px;
    text-align: center;
    color: #fff;
}

.count {
    padding-top: 15px;
    line-height: 27px;
	margin: 0;
}
</style>
