<template>
  <div>
    <div class="long-title"><h3>Personal details</h3></div>
    <div id="form-container">
      <DxForm
        id="form"
        :col-count="2"
        :form-data="employee"
      >
        <DxGroupItem
          caption-template="infoGroupCaption"
          caption="System Information"
        >
          <DxSimpleItem
            data-field="ID"
          />
          <DxGroupItem
            caption-template="userDataGroupCaption"
            caption="Main Information"
          >
            <DxSimpleItem
              data-field="FirstName"
            />
            <DxSimpleItem
              data-field="LastName"
            />
            <DxSimpleItem
              data-field="HireDate"
            />
            <DxSimpleItem
              data-field="Position"
            />
            <DxSimpleItem
              data-field="OfficeNo"
            />
          </DxGroupItem>
        </DxGroupItem>
        <DxGroupItem
          caption-template="personalDataGroupCaption"
          caption="Personal Data"
        >
          <DxSimpleItem
            data-field="BirthDate"
          />
          <DxGroupItem
            caption-template="addressGroupCaption"
            caption="Home Address"
          >
            <DxSimpleItem
              data-field="Address"
            />
            <DxSimpleItem
              data-field="City"
            />
            <DxSimpleItem
              data-field="State"
            />
            <DxSimpleItem
              data-field="Zipcode"
            />
          </DxGroupItem>
        </DxGroupItem>
        <DxGroupItem
          caption-template="contactInfoGroupCaption"
          caption="Contact Information"
        >
          <DxTabbedItem>
            <DxTabPanelOptions
              :defer-rendering="false"
            />
            <DxTab
              title="Phone"
            >
              <DxSimpleItem
                data-field="Phone"
              />
            </DxTab>
            <DxTab
              title="Skype"
            >
              <DxSimpleItem
                data-field="Skype"
              />
            </DxTab>
            <DxTab
              title="Email"
            >
              <DxSimpleItem
                data-field="Email"
              />
            </DxTab>
          </DxTabbedItem>
        </DxGroupItem>

        <template #userDataGroupCaption="{ data }">
          <GroupCaption
            :data="data"
            icon="user"
          />
        </template>
        <template #personalDataGroupCaption="{ data }">
          <GroupCaption
            :data="data"
            icon="card"
          />
        </template>
        <template #contactInfoGroupCaption="{ data }">
          <GroupCaption
            :data="data"
            icon="tel"
          />
        </template>
        <template #addressGroupCaption="{ data }">
          <GroupCaption
            :data="data"
            icon="home"
          />
        </template>
        <template #infoGroupCaption="{ data }">
          <GroupCaption
            :data="data"
          />
        </template>
      </DxForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  DxForm, DxSimpleItem, DxGroupItem, DxTabbedItem, DxTabPanelOptions, DxTab,
} from 'devextreme-vue/form';
import service from './data.ts';
import GroupCaption from './GroupCaption.vue';
import 'devextreme-vue/text-area';

const employee = service.getEmployee();

</script>
<style scoped>
#form-container {
  margin: 10px;
}

.long-title h3 {
  font-size: 24px;
  text-align: center;
  line-height: 2em;
}

.dx-form-group-custom-caption .dx-icon {
  color: var(--dx-color-spin-icon);
}

.dx-form-group-custom-caption span {
  line-height: 1;
}
</style>
