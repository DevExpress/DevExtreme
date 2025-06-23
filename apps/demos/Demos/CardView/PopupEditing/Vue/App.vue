<template>
  <DxCardView
    :data-source="employees"
    key-expr="id"
    cards-per-row="auto"
    :card-min-width="350"
    :height="840"
  >
    <DxSearchPanel
      :visible="true"
    />
    <DxCardCover
      :image-expr="imageExpr"
      :alt-expr="altExpr"
    />
    <DxEditing
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
      :popup="{
        title: 'Employee Info',
        showTitle: true,
        width: 700,
        height: 525,
      }"
    >
      <DxForm>
        <DxItem
          caption="Personal Data"
          item-type="group"
          :col-count="2"
          :col-span="2"
        >
          <DxItem
            data-field="firstName"
          />
          <DxItem
            data-field="lastName"
          />
          <DxItem
            data-field="birthDate"
          />
          <DxItem
            data-field="picture"
          />
        </DxItem>
        <DxItem
          caption="Main Info"
          item-type="group"
          :col-count="2"
          :col-span="2"
        >
          <DxItem
            data-field="hireDate"
          />
          <DxItem
            data-field="title"
          />
          <DxItem
            data-field="department"
          />
          <DxItem
            data-field="notes"
            editor-type="dxTextArea"
            :col-span="2"
            :editor-options="{ height: 100 }"
          />
          <DxItem
            data-field="picture"
          />
        </DxItem>
        <DxItem
          caption="Contacts"
          item-type="group"
          :col-count="2"
          :col-span="2"
        >
          <DxItem
            data-field="address"
            :col-span="2"
          />
          <DxItem
            data-field="city"
          />
          <DxItem
            data-field="zipcode"
          />
          <DxItem
            data-field="mobilePhone"
          />
          <DxItem
            data-field="email"
          />
        </DxItem>
      </DxForm>
    </DxEditing>
    <DxColumn
      caption="Full Name"
      :calculate-field-value="calculateFullName"
    />
    <DxColumn
      data-field="birthDate"
      data-type="date"
    />
    <DxColumn
      data-field="hireDate"
      data-type="date"
    />
    <DxColumn
      caption="Position"
      data-field="title"
    />
    <DxColumn data-field="department"/>
    <DxColumn data-field="address"/>
    <DxColumn data-field="mobilePhone"/>
    <DxColumn data-field="email"/>
    <DxColumn
      data-field="notes"
      :visible="false"
    />
    <DxColumn
      data-field="firstName"
      :visible="false"
    />
    <DxColumn
      data-field="lastName"
      :visible="false"
    />
    <DxColumn
      data-field="city"
      :visible="false"
    />
    <DxColumn
      data-field="zipcode"
      :visible="false"
    />
    <DxColumn
      data-field="picture"
      :visible="false"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import {
  DxCardView, DxColumn, DxCardCover, DxSearchPanel, DxEditing, DxForm, DxItem,
} from 'devextreme-vue/card-view';
import 'devextreme-vue/text-area';
import { employees, type Employee } from './data.ts';

function altExpr({ fullName }: Employee) {
  return `Photo of ${fullName}`;
}

function imageExpr({ picture }: Employee) {
  return picture;
}

function calculateFullName({ firstName, lastName }: Employee) {
  return `${firstName} ${lastName}`;
}
</script>
