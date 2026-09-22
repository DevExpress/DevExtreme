<template>
  <div class="container">
    <div class="left-content">
      <DxTreeView
        :data-source="continents"
        :select-by-click="true"
        selection-mode="single"
        @item-selection-changed="changeSelection"
      />
    </div>
    <div class="right-content">
      <div class="title-container">
        <img
          alt="country flag"
          :src="countryData.flag"
          class="flag"
        >
        <div>
          <div class="country-name">{{ countryData.fullName }}</div>
          <div>{{ countryData.description }}</div>
        </div>
      </div>

      <div class="stats">
        <div>
          <div class="sub-title">Area, km<sup>2</sup></div>
          <div class="stat-value">{{ countryData.area }}</div>
        </div>
        <div>
          <div class="sub-title">Population</div>
          <div class="stat-value">{{ countryData.population }}</div>
        </div>
        <div>
          <div class="sub-title">GDP, billion</div>
          <div class="stat-value">{{ "$" + countryData.gdp }}</div>
        </div>
      </div>

      <div class="sub-title">Largest cities</div>
      <DxTabPanel
        id="tabpanel"
        v-model:selected-index="tabPanelIndex"
        :data-source="citiesData"
        :animation-enabled="true"
        item-title-template="itemTitle"
        item-template="cityTemplate"
      >
        <template #itemTitle="{ data: item }">
          <span class="tab-panel-title">{{ item.text }}</span>
        </template>
        <template #cityTemplate="{ data: city }">
          <div>
            <img
              alt="country flag"
              :src="city.flag"
              class="flag"
            >
            <div class="right-content">
              <div><b>{{ (city.capital) ? "Capital. " : "" }}</b>{{ city.description }}</div>
              <div class="stats">
                <div>
                  <div>Population</div>
                  <div><b>{{ city.population }} people</b></div>
                </div>
                <div>
                  <div>Area</div>
                  <div><b>{{ city.area }} km<sup>2</sup></b></div>
                </div>
                <div>
                  <div>Density</div>
                  <div><b>{{ city.density }}/km<sup>2</sup></b></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTabPanel from 'devextreme-vue/tab-panel';
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view';
import { continents } from './data.ts';

const tabPanelIndex = ref(0);
const countryData = ref<Record<string, any>>(continents[0].items[0]);
const citiesData = ref(continents[0].items[0].cities);

function changeSelection({ itemData }: DxTreeViewTypes.ItemSelectionChangedEvent) {
  if (itemData?.cities) {
    countryData.value = itemData;
    citiesData.value = itemData.cities;
    tabPanelIndex.value = 0;
  }
}
</script>
<style>
.container {
  position: relative;
}

.container,
.left-content {
  min-height: 530px;
}

.left-content {
  display: inline-block;
  width: 180px;
  padding: 0 10px 10px;
  background-color: rgba(191, 191, 191, 0.15);
  box-shadow: -5px 0 14px -8px rgba(0, 0, 0, 0.25) inset;
}

.right-content {
  position: absolute;
  right: 0;
  left: 220px;
  top: 0;
  height: 100%;
}

sup {
  font-size: 0.8em;
  vertical-align: super;
  line-height: 0;
}

.right-content .sub-title {
  font-size: 120%;
  color: var(--dx-texteditor-color-label);
}

.title-container {
  min-height: 140px;
  margin-bottom: 10px;
}

.title-container .country-name {
  font-size: 240%;
  font-weight: bold;
  line-height: 34px;
  margin-bottom: 10px;
}

.title-container > div:not(.flag) {
  margin-left: 204px;
}

.stats {
  display: table;
  width: 100%;
  margin-bottom: 20px;
}

.stats > div {
  display: table-cell;
  text-align: center;
  border: 1px solid rgba(191, 191, 191, 0.25);
  padding: 20px 0 25px;
  width: 33%;
}

.stats > div:first-child,
.stats > div:last-child {
  border-right-width: 0;
  border-left-width: 0;
}

.stats .stat-value {
  font-size: 200%;
}

#tabpanel {
  margin-top: 10px;
}

#tabpanel .dx-multiview-wrapper {
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}

#tabpanel .tab-panel-title {
  font-size: 120%;
  font-weight: 500;
}

#tabpanel .dx-multiview-item-content {
  padding: 20px 0 22px;
  min-height: 178px;
  position: relative;
}

#tabpanel .right-content {
  top: 15px;
  left: 202px;
}

#tabpanel .stats {
  width: 398px;
  margin-top: 20px;
  border-top: 1px solid rgba(191, 191, 191, 0.25);
}

#tabpanel .stats > div {
  padding: 7px 0;
  text-align: left;
  border: 0;
}

#tabpanel .stats > div:first-child {
  width: 40%;
}

#tabpanel .stats > div:not(:first-child) {
  width: 30%;
}

.flag {
  width: 172px;
  max-height: 122px;
  border: 1px solid rgba(191, 191, 191, 0.25);
  float: left;
  margin: 0 30px 10px 0;
}

.left-content .dx-treeview-node.dx-state-selected > .dx-item > .dx-item-content {
  font-weight: 500;
}
</style>
