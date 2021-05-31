<template>
  <div id="data-grid-demo">
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :show-borders="true"
      :selected-row-keys="selectedItemKeys"
      @selection-changed="selectionChanged"
      @toolbar-preparing="onToolbarPreparing"
    >
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        mode="cell"
      />
      <DxPaging :enabled="false"/>
      <DxSelection mode="multiple"/>
      <DxColumn
        :width="55"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn
        data-field="FirstName"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        :width="170"
        data-field="Position"
      />
      <DxColumn
        :width="125"
        data-field="StateID"
        caption="State"
      >
        <DxLookup
          :data-source="states"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <template #deleteButton>
        <DxButton
          @click="deleteRecords()"
          :disabled="!selectedItemKeys.length"
          icon="trash"
          text="Delete Selected Records"
        />
      </template>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxSelection,
  DxLookup
} from 'devextreme-vue/data-grid';

import { DxButton } from 'devextreme-vue/button';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

import { employees, states } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxSelection,
    DxLookup,
    DxButton
  },
  data() {
    return {
      dataSource: new DataSource({
        store: new ArrayStore({
          data: employees,
          key: 'ID'
        })
      }),
      selectedItemKeys: [],
      states: states,
      selectionChanged: (data)=>{
        this.selectedItemKeys = data.selectedRowKeys;
      },
      deleteRecords:()=>{
        this.selectedItemKeys.forEach((key) => {
          this.dataSource.store().remove(key);
        });
        this.selectedItemKeys = [];
        this.dataSource.reload();
      }
    };
  },
  methods: {
    onToolbarPreparing(e) {
      e.toolbarOptions.items[0].showText = 'always';

      e.toolbarOptions.items.push({
        location: 'after',
        template: 'deleteButton'
      });
    }
  }
};
</script>
<style>
#data-grid-demo {
    min-height: 700px;
}

#gridDeleteSelected {
    position: absolute;
    z-index: 1;
    right: 0;
    margin: 1px;
    top: 0;
}

#gridDeleteSelected .dx-button-text {
    line-height: 0;
}
</style>
