<template>
  <DxForm
    :on-content-ready="validateForm"
    :form-data="employee"
  >
    <DxGroupItem
      :col-count="2"
      caption="Employee Details"
    >
      <DxItem
        :editor-options="nameEditorOptions"
        data-field="FirstName"
      >
        <DxLabel template="nameLabel"/>
      </DxItem>
      <DxItem
        :editor-options="positionEditorOptions"
        :validation-rules="validationRules.position"
        data-field="Position"
        editor-type="dxSelectBox"
      >
        <DxLabel template="positionLabel"/>
      </DxItem>
      <DxItem
        :editor-options="nameEditorOptions"
        data-field="LastName"
      >
        <DxLabel template="nameLabel"/>
      </DxItem>
      <DxItem
        :editor-options="hireDateEditorOptions"
        :validation-rules="validationRules.hireDate"
        data-field="HireDate"
        editor-type="dxDateBox"
      >
        <DxLabel template="dateLabel"/>
      </DxItem>
      <DxItem
        :editor-options="birthDateEditorOptions"
        data-field="BirthDate"
        editor-type="dxDateBox"
      >
        <DxLabel template="dateLabel"/>
      </DxItem>
      <DxItem
        data-field="Address"
      >
        <DxLabel template="addressLabel"/>
      </DxItem>
      <DxItem
        :col-span="2"
        :editor-options="notesEditorOptions"
        data-field="Notes"
        editor-type="dxTextArea"
      >
        <DxLabel template="notesLabel"/>
      </DxItem>
      <DxItem
        :editor-options="phoneEditorOptions"
        data-field="Phone"
      >
        <DxLabel template="phoneLabel"/>
      </DxItem>
      <DxItem
        data-field="Email"
      >
        <DxLabel template="emailLabel"/>
      </DxItem>
    </DxGroupItem>

    <template #nameLabel="{ data }">
      <LabelTemplate
        :data="data"
        icon="user"
      />
    </template>
    <template #positionLabel="{ data }">
      <LabelTemplate
        :data="data"
        icon="info"
      />
    </template>
    <template #dateLabel="{ data }">
      <LabelTemplate
        :data="data"
        icon="event"
      />
    </template>
    <template #addressLabel="{ data }">
      <LabelTemplate
        :data="data"
        icon="home"
      />
    </template>
    <template #notesLabel="{ data }">
      <LabelNotesTemplate
        :data="data"
      />
    </template>
    <template #phoneLabel="{ data }">
      <LabelTemplate
        :data="data"
        icon="tel"
      />
    </template>
    <template #emailLabel="{ data }">
      <LabelTemplate
        :data="data"
        icon="email"
      />
    </template>
  </DxForm>
</template>
<script setup lang="ts">
import {
  DxForm, DxItem, DxLabel, DxGroupItem,
} from 'devextreme-vue/form';
import service from './data.ts';
import 'devextreme-vue/text-area';
import LabelTemplate from './LabelTemplate.vue';
import LabelNotesTemplate from './LabelNotesTemplate.vue';

const employee = service.getEmployee();
const positions = service.getPositions();
const validationRules = {
  position: [
    { type: 'required', message: 'Position is required.' },
  ],
  hireDate: [
    { type: 'required', message: 'Hire Date is required.' },
  ],
};
const nameEditorOptions = { disabled: true };
const positionEditorOptions = { items: positions, searchEnabled: true, value: '' };
const hireDateEditorOptions = { width: '100%', value: null };
const birthDateEditorOptions = { width: '100%', disabled: true };
const notesEditorOptions = { height: 90, maxLength: 200 };
const phoneEditorOptions = { mask: '+1 (X00) 000-0000', maskRules: { X: /[02-9]/ } };

function validateForm(e) {
  e.component.validate();
}
</script>
