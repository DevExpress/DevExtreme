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
          :caption-template="groupCaptionTemplate('info')"
          caption="System Information"
        >
          <DxSimpleItem
            data-field="ID"
          />
          <DxGroupItem
            :caption-template="groupCaptionTemplate('user')"
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
          :caption-template="groupCaptionTemplate('accountbox')"
          caption="Personal Data"
        >
          <DxSimpleItem
            data-field="BirthDate"
          />
          <DxGroupItem
            :caption-template="groupCaptionTemplate('home')"
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
          :caption-template="groupCaptionTemplate('tel')"
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
      </DxForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  DxForm, DxSimpleItem, DxGroupItem, DxTabbedItem, DxTabPanelOptions, DxTab,
} from 'devextreme-vue/form';
import service from './data.ts';
import 'devextreme-vue/text-area';

const employee = service.getEmployee();

function groupCaptionTemplate(icon){
    return (data) => { 
      return `<i class='dx-icon dx-icon-${icon}'></i><span>${data.caption}</span>`;
  }
};

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

.dx-form-group-custom-caption {
  display: flex;
  align-items: center;
  font-size: var(--dx-font-size-md);
}

.dx-form-group-custom-caption .dx-icon {
  color: var(--dx-color-spin-icon);
}

.dx-form-group-custom-caption span {
  line-height: 1;
}
</style>
