<template>
  <div id="data-grid-demo">
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :show-borders="true"
      :selected-row-keys="selectedItemKeys"
      @selection-changed="onSelectionChanged"
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
      <DxToolbar>
        <DxItem
          name="addRowButton"
          show-text="always"
        />
        <DxItem location="after">
          <template #default>
            <DxButton
              @click="deleteRecords"
              :disabled="!selectedItemKeys.length"
              icon="trash"
              text="Delete Selected Records"
            />
          </template>
        </DxItem>
      </DxToolbar>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxSelection,
  DxLookup,
  DxToolbar,
  DxItem,
  DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { DxButton } from 'devextreme-vue/button';

import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

import { Employee, employees, states } from './data.ts';

const dataSource = new DataSource<Employee, number>({
  store: new ArrayStore({
    data: employees,
    key: 'ID',
  }),
});

const selectedItemKeys = ref<number[]>([]);

const onSelectionChanged = (e: DxDataGridTypes.SelectionChangedEvent<Employee, number>) => {
  selectedItemKeys.value = e.selectedRowKeys;
};

const deleteRecords = () => {
  selectedItemKeys.value.forEach((key) => {
    dataSource.store().remove(key);
  });

  selectedItemKeys.value = [];
  dataSource.reload();
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
