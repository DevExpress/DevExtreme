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
              :template-data="employee"
            />
          </template>
        </DxTabPanel>
      </div>
    </DxSortable>
  </div>
</template>
<script>
import DxSortable from 'devextreme-vue/sortable';
import DxButton from 'devextreme-vue/button';
import DxTabPanel from 'devextreme-vue/tab-panel';
import { DxDataGrid } from 'devextreme-vue/data-grid';

import EmployeeTemplate from './EmployeeTemplate.vue';
import service from './data.js';

const allEmployees = service.getEmployees();

export default {
  components: {
    DxButton,
    DxTabPanel,
    DxDataGrid,
    DxSortable,
    EmployeeTemplate
  },
  data() {
    return {
      employees: allEmployees.slice(0, 3),
      selectedIndex: 0
    };
  },
  methods: {
    onTabDragStart(e) {
      e.itemData = e.fromData[e.fromIndex];
    },

    onTabDrop(e) {
      e.fromData.splice(e.fromIndex, 1);
      e.toData.splice(e.toIndex, 0, e.itemData);
    },

    addButtonHandler() {
      const newItem = allEmployees.filter(employee => this.employees.every(item => employee.ID !== item.ID))[0];

      this.selectedIndex = this.employees.length;
      this.employees = [...this.employees, newItem];
    },

    closeButtonHandler(itemData) {
      const index = this.employees.indexOf(itemData);

      this.employees.splice(index, 1);
      if(index >= this.employees.length && index > 0) this.selectedIndex = index - 1;
    },

    disableButton() {
      return this.employees.length === allEmployees.length;
    },

    showCloseButton() {
      return this.employees.length > 1;
    }
  }
};
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
.dx-tab-content .dx-icon.dx-icon-close {
  display: inline-block;
  opacity: 0.6;
  margin-right: 0;
  margin-left: 7px;
  font-size: 18px;
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
  padding-left: 14px;
  padding-right: 9px;
  line-height: 1.618;
}
.dx-theme-generic .dx-icon.dx-icon-close {
  font-size: 15px;
}
.dx-theme-material .dx-tab-content span {
  vertical-align: middle;
  line-height: initial;
}
.dx-theme-material .employeeNotes {
  margin: 0;
}
</style>
