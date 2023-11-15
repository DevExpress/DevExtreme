<template>
  <div>
    <div id="container">
      <DxButton
        :disabled="disableButton()"
        text="Add Tab"
        icon="add"
        type="default"
        @click="addButtonHandler"
      />
    </div>
    <DxSortable
      filter=".dx-tab"
      v-model:data="employees"
      item-orientation="horizontal"
      drag-direction="horizontal"
      @drag-start="onTabDragStart($event)"
      @reorder="onTabDrop($event)"
    >
      <div>
        <DxTabPanel
          v-model:data-source="employees"
          :height="410"
          :defer-rendering="false"
          :show-nav-buttons="true"
          :repaint-changes-only="true"
          v-model:selected-index="selectedIndex"
          item-title-template="title"
          item-template="itemTemplate"
        >
          <template #title="{ data: employee }">
            <div>
              <span>{{ employee.FirstName }} {{ employee.LastName }}</span><i
                v-show="showCloseButton()"
                class="dx-icon dx-icon-close"
                @click="closeButtonHandler(employee)"
              />
            </div>
          </template>
          <template #itemTemplate="{ data: employee }">
            <EmployeeTemplate
              :employee="employee"
            />
          </template>
        </DxTabPanel>
      </div>
    </DxSortable>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxSortable from 'devextreme-vue/sortable';
import DxButton from 'devextreme-vue/button';
import DxTabPanel from 'devextreme-vue/tab-panel';
import EmployeeTemplate from './EmployeeTemplate.vue';
import service from './data.js';

const allEmployees = service.getEmployees();
const employees = ref(allEmployees.slice(0, 3));
const selectedIndex = ref(0);

function onTabDragStart(e) {
  e.itemData = e.fromData[e.fromIndex];
}
function onTabDrop(e) {
  const newEmployees = [...employees.value];

  newEmployees.splice(e.fromIndex, 1);
  newEmployees.splice(e.toIndex, 0, e.itemData);

  employees.value = newEmployees;
}
function addButtonHandler() {
  const newItem = allEmployees
    .filter((employee) => employees.value.every((item) => employee.ID !== item.ID))[0];

  selectedIndex.value = employees.value.length;
  employees.value = [...employees.value, newItem];
}
function closeButtonHandler(itemData) {
  const index = employees.value.indexOf(itemData);

  employees.value = employees.value.filter((e) => e !== itemData);
  if (index >= employees.value.length && index > 0) selectedIndex.value = index - 1;
}
function disableButton() {
  return employees.value.length === allEmployees.length;
}
function showCloseButton() {
  return employees.value.length > 1;
}
</script>
<style>
#container {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}

.dx-tabs .dx-tabs-wrapper .dx-item.dx-tab {
  width: auto;
  padding-left: 20px;
}

.dx-sortable-dragging .dx-tab {
  box-sizing: border-box;
  text-align: center;
}

.employeeInfo .employeePhoto {
  height: 100px;
  float: left;
  padding: 10px 20px 10px 20px;
}

.employeeInfo .employeeNotes {
  min-height: 100px;
  padding: 20px;
  text-align: justify;
  white-space: normal;
}

.dx-theme-generic .dx-tabs-wrapper .dx-item.dx-tab {
  max-width: fit-content;
  padding-left: 14px;
  padding-right: 9px;
  line-height: 1.618;
}

.dx-tabpanel .dx-tab .dx-icon.dx-icon-close {
  display: inline-block;
  margin-right: 0;
  margin-left: 7px;
  opacity: 0.6;
}

.dx-theme-generic .dx-tabpanel .dx-tab .dx-icon.dx-icon-close {
  font-size: 15px;
}

.dx-theme-material .dx-tabpanel .dx-tab .dx-icon.dx-icon-close {
  font-size: 18px;
}

.dx-theme-material .dx-tab-content {
  flex-direction: row;
}

.dx-theme-material .employeeNotes {
  margin: 0;
}
</style>
