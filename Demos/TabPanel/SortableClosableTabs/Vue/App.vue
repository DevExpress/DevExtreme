<template>
  <div>
    <div id="container">
      <DxButton
        :disabled="isAddButtonDisabled"
        text="Add Tab"
        icon="add"
        type="default"
        @click="addButtonHandler"
      />
      <DxButton
        :disabled="isRemoveButtonDisabled"
        text="Remove Tab"
        icon="trash"
        type="danger"
        styling-mode="outlined"
        @click="closeButtonHandler(selectedItem)"
      />
    </div>
    <DxSortable
      filter=".dx-tab"
      :data.sync="employees"
      item-orientation="horizontal"
      @drag-start="onTabDragStart($event)"
      @reorder="onTabDrop($event)"
    >
      <div>
        <DxTabPanel
          :data-source.sync="employees"
          :height="472"
          :defer-rendering="false"
          :show-nav-buttons="true"
          :repaint-changes-only="true"
          :animation-enabled="true"
          :selected-item.sync="selectedItem"
          :selected-index.sync="selectedIndex"
          item-title-template="title"
          item-template="itemTemplate"
        >
          <template #title="{ data: employee }">
            <div>
              <span>{{ employee.FirstName }} {{ employee.LastName }}</span>
              <i
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
import { DxSortable, DxButton, DxTabPanel } from 'devextreme-vue';
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
      selectedItem: allEmployees[0],
      selectedIndex: 0,
      isAddButtonDisabled: false,
      isRemoveButtonDisabled: false
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
      const newItem = allEmployees.filter(employee => this.employees.indexOf(employee) === -1)[0];

      this.employees.push(newItem);
      this.selectedItem = newItem;

      this.updateButtonsAppearance();
    },

    closeButtonHandler(itemData) {
      if(!itemData) return;

      const index = this.employees.indexOf(itemData);

      this.employees.splice(index, 1);
      if(index >= this.employees.length && index > 0) this.selectedIndex = index - 1;

      this.updateButtonsAppearance();
    },

    updateButtonsAppearance() {
      this.isAddButtonDisabled = this.employees.length === allEmployees.length;
      this.isRemoveButtonDisabled = this.employees.length === 0;
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

#container .dx-button-danger {
    margin-left: 4px;
}

.dx-tabs-wrapper .dx-tab {
  width: auto;
  padding-left: 20px;
}

.dx-tab-content .dx-icon-close {
    opacity: 0.6;
    font-size: 15px;
    margin-right: 0;
    margin-left: 3px;
}

.dx-theme-material .dx-tab-content .dx-icon-close {
    display: inline-block;
    font-size: 18px;
}

.dx-theme-material .dx-tab-content span {
    vertical-align: middle;
    line-height: initial;
}

.dx-sortable-dragging .dx-tab {
  box-sizing: border-box;
  text-align: center;
}

.employeeInfo .employeePhoto {
  height: 100px;
  float: left;
  padding: 10px 10px 10px 20px;
}

.employeeInfo .employeeNotes {
  min-height: 100px;
  padding: 20px;
  text-align: justify;
  white-space: normal;
}

.dx-theme-material .employeeNotes {
  margin: 0;
}
</style>
