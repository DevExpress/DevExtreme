<template>
  <example-block title="dxDataGrid">
    <div class="flex-container">
      <span class="label">Date Filter:</span>
      <dx-date-box v-model:value="dateFilter" />
      <span class="label">Alternate Row Colors:</span>
      <dx-check-box v-model:value="alternateRowColors" />
      <span class="label">Filter Row Visible:</span>
      <dx-check-box v-model:value="filterRowVisible" />
      <span class="label">Country Sort Order:</span>
      <dx-switch
        v-model:value="countrySortOrderVal"
        offText="des"
        onText="asc"
      />
    </div>
    <dx-data-grid
      :dataSource="sales"
      keyExpr="orderId"
      :allowColumnReordering="true"
      :rowAlternationEnabled="alternateRowColors"
      :selectedRowKeys="selectedRowKeys"
      @toolbarPreparing="toolbarPreparing"
    >
      <dx-filter-row :visible="filterRowVisible" />
      <dx-group-panel :visible="true" />
      <dx-grouping :autoExpandAll="autoExpandAll" />
      <dx-selection mode="multiple" />
      <dx-column
        dataField="orderId"
        caption="Order ID"
        :allowSorting="false"
        :allowFiltering="false"
        :allowGrouping="false"
        :allowReordering="false"
        :width="100"
      />
      <dx-column dataField="city" cellTemplate="cell-city" />
      <dx-column dataField="country" v-model:sortOrder="countrySortOrder" />
      <dx-column dataField="region" :groupIndex="0" />
      <dx-column
        dataField="date"
        dataType="date"
        selectedFilterOperation=">="
        v-model:filterValue="dateFilter"
        :width="150"
      />
      <dx-column
        dataField="amount"
        format="currency"
        selectedFilterOperation=">="
        :filterValue="1000"
        :width="100"
      />
      <dx-pager :visible="true" :showPageSizeSelector="true" />
      <dx-paging :pageSize="10" />
      <template v-slot:cell-city="{ data }">
        <dx-button :text="data.text" />
      </template>
    </dx-data-grid>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import {
  DxButton,
  DxCheckBox,
  DxDataGrid,
  DxDateBox,
  DxSwitch
} from "devextreme-vue";
import {
  DxColumn,
  DxFilterRow,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSelection
} from "devextreme-vue/data-grid";
import { sales } from "../data";

const selectedKeys = [
  10273,
  10277,
  10292,
  10295,
  10300,
  10302,
  10305,
  10308,
  10312,
  10319,
  10321,
  10323,
  10326,
  10328,
  10331,
  10334,
  10335,
  10341,
  10351,
  10353,
  10356,
  10362,
  10367,
  10373,
  10376,
  10383,
  10387,
];

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxCheckBox,
    DxDataGrid,
    DxDateBox,
    DxSwitch,
    DxColumn,
    DxFilterRow,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSelection
  },
  computed: {
    countrySortOrder: {
      get() {
        return this.countrySortOrderVal ? "asc" : "desc";
      },
      set(newValue) {
        this.countrySortOrderVal = newValue === "asc";
      }
    }
  },
  methods: {
    toolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
        location: "after",
        widget: "dxButton",
        options: {
          icon: "chevronup",
          onClick: (e) => {
            this.autoExpandAll = e.component.option("icon") === "chevrondown";
            e.component.option(
              "icon",
              this.autoExpandAll ? "chevronup" : "chevrondown"
            );
          }
        }
      });
    }
  },
  data: function () {
    return {
      dateFilter: "2013/04/01",
      sales: sales,
      selectedRowKeys: selectedKeys,
      alternateRowColors: true,
      filterRowVisible: true,
      countrySortOrderVal: true,
      autoExpandAll: true
    };
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
}
.label {
  color: black;
  padding-top: .6em;
}
.dx-checkbox {
  padding-top: .4em;
}
.dx-switch {
  padding-top: .2em;
}
</style>
