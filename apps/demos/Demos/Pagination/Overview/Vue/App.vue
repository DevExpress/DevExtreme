<template>
  <div
    class="employees"
    :class="{
      'employees--forth': pageSize === 4,
      'employees--six': pageSize === 6,
    }"
  >
    <div
      class="employees__card"
      v-for="employee in pageEmployees"
    >
      <div class="employees__img-wrapper">
        <img
          class="employees__img"
          :src="employee.Picture"
          :alt="employee.FullName"
        >
      </div>
      <div class="employees__info">
        <div class="employees__info-row">
          <span class="employees__info-label">Full Name:</span>
          <span class="employees__info-value">{{ employee.FullName }}</span>
        </div>
        <div class="employees__info-row">
          <span class="employees__info-label">Position:</span>
          <span class="employees__info-value">{{ employee.Title }}</span>
        </div>
        <div class="employees__info-row">
          <span class="employees__info-label">Phone:</span>
          <span class="employees__info-value">{{ employee.MobilePhone }}</span>
        </div>
      </div>
    </div>
  </div>

  <DxPagination
    :show-info="showInfo"
    :show-navigation-buttons="showPageSizeSelector"
    :allowed-page-sizes="pageSizes"
    v-model:page-index="pageIndex"
    v-model:page-size="pageSize"
    :item-count="itemCount"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DxPagination from 'devextreme-vue/pagination';
import { employees } from './data.ts';

const getPageEmployees = (pageIndex, pageSize) => employees.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

const pageSizes = [4, 6];
const showInfo = true;
const showPageSizeSelector = true;
const pageIndex = ref(1);
const pageSize = ref(4);
const itemCount = employees.length;
const pageEmployees = computed(() => getPageEmployees(pageIndex.value, pageSize.value));
</script>

<style>
body {
  overflow-x: hidden;
}

.demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  min-width: 720px;
  width: 100%;
}

.employees {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  min-height: 644px;
  padding-bottom: 24px;
}

.employees__card {
  width: 100%;
  max-height: 312px;
  align-self: stretch;
  overflow: hidden;
  border: var(--dx-border-width) solid var(--dx-color-border);
  border-radius: var(--dx-border-radius);
  background-color: var(--dx-component-color-bg);
}

.employees.employees--forth .employees__card {
  min-width: 250px;
  width: 390px;
  flex-basis: calc(50% - 10px);
}

.employees.employees--six .employees__card {
  flex-basis: calc(33.3% - 12.5px);
}

.employees__img-wrapper {
  height: 180px;
  position: relative;
  overflow: hidden;
  border-bottom: var(--dx-border-width) solid var(--dx-color-border);
  background-color: #fff;
}

.employees__img {
  display: block;
  height: 220px;
  position: absolute;
  content: "";
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.employees__info {
  padding: 24px;
}

.employees__info-row {
  margin-bottom: 8px;
  text-wrap: nowrap;
}

.employees__info-label {
  display: inline-block;
  font-weight: 600;
  vertical-align: middle;
}

.employees.employees--forth .employees__info-label {
  width: 160px;
}

.employees.employees--six .employees__info-label {
  width: 80px;
}

.employees__info-value {
  display: inline-block;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  overflow: hidden;
  white-space:nowrap
}

.employees.employees--forth .employees__info-value {
  max-width: 180px;
}

.employees.employees--six .employees__info-value {
  max-width: 120px;
}
</style>
