<template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder
        ref="filterBuilderRef"
        :fields="fields"
        v-model:value="filter"
      />
      <DxButton
        text="Apply Filter"
        type="default"
        @click="refreshDataSource()"
      />
      <div class="dx-clearfix"/>
    </div>
    <div class="list-container">
      <DxList :data-source="dataSource">
        <template #item="{ data: item }">
          <CustomItem
            :item="item"
          />
        </template>
      </DxList>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DxFilterBuilder from 'devextreme-vue/filter-builder';
import DxButton from 'devextreme-vue/button';
import DxList from 'devextreme-vue/list';
import DataSource from 'devextreme/data/data_source';
import CustomItem from './CustomItem.vue';
import { filter, fields, products } from './data.ts';

const filterBuilderRef = ref(null);
const dataSource = new DataSource({
  store: products,
});

onMounted(() => {
  refreshDataSource();
});

function refreshDataSource() {
  dataSource.filter(filterBuilderRef.value.instance.getFilterExpression());
  dataSource.load();
}
</script>
<style scoped>
.filter-container {
  background-color: transparent;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.14), 0 0 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  width: 45%;
  float: left;
  margin: 24px;
  height: 430px;
}

.dx-filterbuilder {
  background-color: transparent;
  padding: 10px;
  height: 360px;
  margin: 5px;
  overflow: auto;
}

.dx-filterbuilder .dx-texteditor {
  width: 135px;
}

.dx-button {
  margin: 10px 20px;
  float: right;
}

.list-container {
  float: right;
  width: 45%;
}

.list-container .dx-scrollable-container {
  max-height: 430px;
  padding-left: 30px;
}

.dx-filterbuilder .dx-numberbox {
  width: 80px;
}
</style>
