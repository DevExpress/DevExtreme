<template>
  <div id="container">
    <DxDiagram
      id="diagram"
      ref="diagram"
      custom-shape-template="CustomShapeTemplate"
      custom-shape-toolbox-template="CustomShapeToolboxTemplate"
      @request-layout-update="onRequestLayoutUpdate"
    >
      <DxCustomShape
        :type="'employee'"
        :category="'employee'"
        :base-type="'rectangle'"
        :title="'New Employee'"
        :default-width="1.5"
        :default-height="1"
        :toolbox-width-to-height-ratio="2"
        :min-width="1.5"
        :min-height="1"
        :max-width="3"
        :max-height="2"
        :allow-edit-text="false"
      />
      <template #CustomShapeTemplate="{ data }">
        <CustomShapeTemplate
          :employee="data.dataItem"
          :edit-employee="editEmployee"
          :delete-employee="deleteEmployee"
        />
      </template>
      <template #CustomShapeToolboxTemplate="{ data }">
        <CustomShapeToolboxTemplate/>
      </template>
      <DxNodes
        :data-source="dataSource"
        :key-expr="'ID'"
        :type-expr="itemTypeExpr"
        :custom-data-expr="itemCustomDataExpr"
        :parent-key-expr="'Head_ID'"
      >
        <DxAutoLayout :type="'tree'"/>
      </DxNodes>
      <DxContextToolbox
        :shape-icons-per-row="1"
        :width="100"
      />
      <DxToolbox
        :show-search="false"
        :shape-icons-per-row="1"
      >
        <DxGroup
          :category="'employee'"
          :title="'Employee'"
          :expanded="true"
        />
      </DxToolbox>
      <DxPropertiesPanel>
        <DxTab>
          <DxGroup
            :title="'Page Properties'"
            :commands="['pageSize', 'pageOrientation' , 'pageColor' ]"
          />
        </DxTab>
      </DxPropertiesPanel>
    </DxDiagram>

    <DxPopup
      v-model:visible="popupVisible"
      :drag-enabled="false"
      :show-title="true"
      :width="400"
      :height="480"
      title="Edit Employee"
    >
      <div class="dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">Name</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.Full_Name"/>
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Title</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.Title"/>
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">City</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.City"/>
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">State</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.State"/>
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Email</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.Email"/>
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Skype</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.Skype"/>
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Phone</div>
          <div class="dx-field-value">
            <DxTextBox v-model:value="currentEmployee.Mobile_Phone"/>
          </div>
        </div>
      </div>
      <div class="dx-fieldset buttons">
        <DxButton
          :text="'Update'"
          :type="'default'"
          @click="updateEmployee"
        />
        <DxButton
          :text="'Cancel'"
          @click="cancelEditEmployee"
        />
      </div>
    </DxPopup>
  </div>
</template>
<script>

import { DxDiagram, DxNodes, DxAutoLayout, DxCustomShape, DxContextToolbox, DxPropertiesPanel, DxGroup, DxTab, DxToolbox } from 'devextreme-vue/diagram';
import { DxPopup } from 'devextreme-vue/popup';
import DxTextBox from 'devextreme-vue/text-box';
import DxButton from 'devextreme-vue/button';
import ArrayStore from 'devextreme/data/array_store';
import CustomShapeTemplate from './CustomShapeTemplate.vue';
import CustomShapeToolboxTemplate from './CustomShapeToolboxTemplate.vue';
import service from './data.js';

export default {
  components: {
    DxDiagram, DxNodes, DxAutoLayout, DxCustomShape, DxContextToolbox, DxPropertiesPanel, DxGroup, DxTab, DxToolbox, CustomShapeTemplate, CustomShapeToolboxTemplate, DxPopup, DxTextBox, DxButton
  },
  data() {
    var that = this;
    this.generatedID = 100;
    return {
      employees: service.getEmployees(),
      dataSource: new ArrayStore({
        key: 'ID',
        data: service.getEmployees(),
        onInserting: function(values) {
          values.ID = values.ID || that.generatedID++;
          values.Full_Name = values.Full_Name || "Employee's Name";
          values.Title = values.Title || "Employee's Title";
        }
      }),
      currentEmployee: {},
      popupVisible: false
    };
  },
  methods: {
    itemTypeExpr() {
      return 'employee';
    },
    itemCustomDataExpr(obj, value) {
      if(value === undefined) {
        return {
          'Full_Name': obj.Full_Name,
          'Prefix': obj.Prefix,
          'Title': obj.Title,
          'City': obj.City,
          'State': obj.State,
          'Email': obj.Email,
          'Skype': obj.Skype,
          'Mobile_Phone': obj.Mobile_Phone
        };
      } else {
        obj.Full_Name = value.Full_Name;
        obj.Prefix = value.Prefix;
        obj.Title = value.Title;
        obj.City = value.City;
        obj.State = value.State;
        obj.Email = value.Email;
        obj.Skype = value.Skype;
        obj.Mobile_Phone = value.Mobile_Phone;
      }
    },
    onRequestLayoutUpdate(e) {
      for(var i = 0; i < e.changes.length; i++) {
        if(e.changes[i].type === 'remove') {
          e.allowed = true;
        } else if(e.changes[i].data.Head_ID !== undefined && e.changes[i].data.Head_ID !== null) {
          e.allowed = true;
        }
      }
    },
    editEmployee(employee) {
      this.currentEmployee = Object.assign({
        'Full_Name': '',
        'Prefix': '',
        'Title': '',
        'City': '',
        'State': '',
        'Email': '',
        'Skype': '',
        'Mobile_Phone': ''
      }, employee);
      this.popupVisible = true;
    },
    deleteEmployee(employee) {
      this.dataSource.push([{ type: 'remove', key: employee.ID }]);
    },
    updateEmployee() {
      this.dataSource.push([{
        type: 'update',
        key: this.currentEmployee.ID,
        data: {
          'Full_Name': this.currentEmployee.Full_Name,
          'Title': this.currentEmployee.Title,
          'City': this.currentEmployee.City,
          'State': this.currentEmployee.State,
          'Email': this.currentEmployee.Email,
          'Skype': this.currentEmployee.Skype,
          'Mobile_Phone': this.currentEmployee.Mobile_Phone
        }
      }]);
      this.currentEmployee = {};
      this.popupVisible = false;
    },
    cancelEditEmployee() {
      this.currentEmployee = {};
      this.popupVisible = false;
    }
  }
};
</script>
<style scoped>
    #diagram {
        height: 725px;
    }

    .dx-popup-content {
        padding: 0;
    }

    .dx-popup-content .dx-fieldset.buttons {
        display: flex;
        justify-content: flex-end;
    }

    .dx-popup-content .dx-fieldset.buttons > * {
        margin-left: 8px;
    }
</style>
