<template>
  <div>
    <DxToolbar>
      <DxItem
        :options="backButtonOptions"
        location="before"
        widget="dxButton"
      />
      <DxItem
        :options="refreshButtonOptions"
        location="before"
        widget="dxButton"
      />
      <DxItem
        location="center"
        locate-in-menu="never"
      >
        <div class="toolbar-label"><b>Tom's Club</b> Products</div>
      </DxItem>
      <DxItem
        :options="selectBoxOptions"
        location="after"
        locate-in-menu="auto"
        widget="dxSelectBox"
      />
      <DxItem
        :options="addButtonOptions"
        location="after"
        locate-in-menu="auto"
        widget="dxButton"
      />
      <DxItem
        :options="saveButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        :options="printButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
      <DxItem
        :options="settingsButtonOptions"
        locate-in-menu="always"
        widget="dxButton"
      />
    </DxToolbar>
    <DxList
      id="products"
      :data-source="productsStore"
    />
  </div>
</template>
<script setup lang="ts">
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import DxList from 'devextreme-vue/list';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import 'devextreme/ui/select_box';
import { productTypes, products } from './data.ts';

const productsStore = new DataSource(products);
const backButtonOptions = {
  icon: 'back',
  onClick: () => {
    notify('Back button has been clicked!');
  },
};
const refreshButtonOptions = {
  icon: 'refresh',
  onClick: () => {
    notify('Refresh button has been clicked!');
  },
};
const selectBoxOptions = {
  width: 140,
  items: productTypes,
  valueExpr: 'id',
  displayExpr: 'text',
  value: productTypes[0].id,
  inputAttr: { 'aria-label': 'Categories' },
  onValueChanged: ({ value }) => {
    productsStore.filter(value > 1 ? ['type', '=', value] : null);
    productsStore.load();
  },
};
const addButtonOptions = {
  icon: 'plus',
  onClick: () => {
    notify('Add button has been clicked!');
  },
};
const saveButtonOptions = {
  text: 'Save',
  onClick: () => {
    notify('Save option has been clicked!');
  },
};
const printButtonOptions = {
  text: 'Print',
  onClick: () => {
    notify('Print option has been clicked!');
  },
};
const settingsButtonOptions = {
  text: 'Settings',
  onClick: () => {
    notify('Settings option has been clicked!');
  },
};
</script>
<style>
.toolbar-label,
.toolbar-label > b {
  font-size: 16px;
}

#products {
  margin-top: 10px;
}
</style>
