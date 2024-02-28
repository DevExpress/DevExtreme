<template>
  <example-block title="Form">
    <dx-form :colCount="2" :formData="employee">
      <dx-simple-item dataField="ID" />
      <dx-simple-item
        dataField="FirstName"
        :editorOptions="{ disabled: true }"
      />
      <dx-simple-item
        dataField="LastName"
        :editorOptions="{ disabled: true }"
      />
      <dx-simple-item
        dataField="Position"
        editorType="dxSelectBox"
        :editorOptions="positions"
      >
        <dx-required-rule message="Position is required" />
      </dx-simple-item>
      <dx-simple-item
        dataField="BirthDate"
        editorType="dxDateBox"
        :editorOptions="{ disabled: true, width: '100%' }"
      />
      <dx-simple-item
        dataField="HireDate"
        editorType="dxDateBox"
        :editorOptions="{ value: null, width: '100%' }"
      >
        <dx-required-rule message="Hire date is required" />
      </dx-simple-item>
      <dx-simple-item dataField="Notes" :colSpan="2" template="item" />
      <template v-slot:item="{ data }">
        <dx-text-area :minHeight="80" :value="data.editorOptions.value" />
      </template>
      <dx-simple-item dataField="Address" />
      <dx-simple-item
        dataField="Phone"
        :editorOptions="{
          mask: '+1 (X00) 000-0000',
          maskRules: { X: /[02-9]/ }
        }"
      />
    </dx-form>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import {
  DxForm,
  DxTextArea
} from "devextreme-vue";
import { DxSimpleItem, DxRequiredRule } from "devextreme-vue/form";

const employee = {
  ID: 1,
  FirstName: "John",
  LastName: "Heart",
  Position: "CEO",
  BirthDate: "1964/03/16",
  HireDate: "1995/01/15",
  Notes: "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.",
  Address: "351 S Hill St., Los Angeles, CA",
  Phone: "360-684-1334"
};

export default {
  components: {
    ExampleBlock,
    DxForm,
    DxTextArea,
    DxSimpleItem,
    DxRequiredRule
  },
  data() {
    return {
      employee,
      positions: {
        items: [
          "HR Manager",
          "IT Manager",
          "CEO",
          "Controller",
          "Sales Manager",
          "Support Manager",
          "Shipping Manager"
        ],
        value: ""
      }
    };
  }
};
</script>
