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
            <DxTextBox
              v-model:value="currentEmployee.Full_Name"
              :input-attr="{ 'aria-label': 'Full Name' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Title</div>
          <div class="dx-field-value">
            <DxTextBox
              v-model:value="currentEmployee.Title"
              :input-attr="{ 'aria-label': 'Title' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">City</div>
          <div class="dx-field-value">
            <DxTextBox
              v-model:value="currentEmployee.City"
              :input-attr="{ 'aria-label': 'City' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">State</div>
          <div class="dx-field-value">
            <DxTextBox
              v-model:value="currentEmployee.State"
              :input-attr="{ 'aria-label': 'State' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Email</div>
          <div class="dx-field-value">
            <DxTextBox
              v-model:value="currentEmployee.Email"
              :input-attr="{ 'aria-label': 'Email' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Skype</div>
          <div class="dx-field-value">
            <DxTextBox
              v-model:value="currentEmployee.Skype"
              :input-attr="{ 'aria-label': 'Skype' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Phone</div>
          <div class="dx-field-value">
            <DxTextBox
              v-model:value="currentEmployee.Mobile_Phone"
              :input-attr="{ 'aria-label': 'Phone' }"
            />
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
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDiagram,
  DxNodes,
  DxAutoLayout,
  DxCustomShape,
  DxContextToolbox,
  DxPropertiesPanel,
  DxGroup,
  DxTab,
  DxToolbox,
} from 'devextreme-vue/diagram';
import { DxPopup } from 'devextreme-vue/popup';
import DxTextBox from 'devextreme-vue/text-box';
import DxButton from 'devextreme-vue/button';
import ArrayStore from 'devextreme/data/array_store';
import CustomShapeTemplate from './CustomShapeTemplate.vue';
import CustomShapeToolboxTemplate from './CustomShapeToolboxTemplate.vue';
import service from './data.js';

let generatedID = 100;
const dataSource = new ArrayStore({
  key: 'ID',
  data: service.getEmployees(),
  onInserting(values) {
    values.ID = values.ID || (generatedID += 1);
    values.Full_Name = values.Full_Name || "Employee's Name";
    values.Title = values.Title || "Employee's Title";
  },
});
const currentEmployee = ref({} as Record<string, any>);
const popupVisible = ref(false);

const itemTypeExpr = () => 'employee';
function itemCustomDataExpr(obj, value) {
  if (value === undefined) {
    return { ...obj };
  }
  Object.assign(obj, value);
  return null;
}
function onRequestLayoutUpdate(e) {
  for (let i = 0; i < e.changes.length; i += 1) {
    if (e.changes[i].type === 'remove') {
      e.allowed = true;
    } else if (e.changes[i].data.Head_ID !== undefined && e.changes[i].data.Head_ID !== null) {
      e.allowed = true;
    }
  }
}
function editEmployee(employee) {
  currentEmployee.value = {
    Full_Name: '',
    Prefix: '',
    Title: '',
    City: '',
    State: '',
    Email: '',
    Skype: '',
    Mobile_Phone: '',
    ...employee,
  };
  popupVisible.value = true;
}
function deleteEmployee(employee) {
  dataSource.push([{ type: 'remove', key: employee.ID }]);
}
function updateEmployee() {
  dataSource.push([{
    type: 'update',
    key: currentEmployee.value.ID,
    data: { ...currentEmployee.value },
  }]);
  currentEmployee.value = {};
  popupVisible.value = false;
}
function cancelEditEmployee() {
  currentEmployee.value = {};
  popupVisible.value = false;
}
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
