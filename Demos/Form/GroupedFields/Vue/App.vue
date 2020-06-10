<template>
  <div>
    <div class="long-title"><h3>Personal details</h3></div>
    <div id="form-container">
      <DxForm
        id="form"
        :col-count="2"
        :form-data="employee"
      >
        <DxItem
          :items="groupedItems.systemInformation"
          item-type="group"
          caption="System Information"
        />
        <DxItem
          :items="groupedItems.personalData"
          item-type="group"
          caption="Personal Data"
        />
        <DxItem
          :items="groupedItems.contactInformation"
          item-type="group"
          caption="Contact Information"
        />
      </DxForm>
    </div>
  </div>
</template>
<script>
import { DxForm, DxItem } from 'devextreme-vue/form';
import service from './data.js';
import 'devextreme-vue/text-area';

export default {
  components: {
    DxForm,
    DxItem
  },
  data() {
    const employee = service.getEmployee();
    return {
      employee,
      groupedItems: {
        systemInformation: [
          'ID', 'FirstName', 'LastName', 'HireDate', 'Position', 'OfficeNo'
        ],
        personalData: [
          'BirthDate',
          {
            itemType: 'group',
            caption: 'Home Address',
            items: ['Address', 'City', 'State', 'Zipcode']
          }

        ],
        contactInformation: [{
          itemType: 'tabbed',
          tabPanelOptions: {
            deferRendering: false
          },
          tabs: [{
            title: 'Phone',
            items: ['Phone']
          }, {
            title: 'Skype',
            items: ['Skype']
          }, {
            title: 'Email',
            items: ['Email']
          }]
        }
        ]
      }
    };
  }
};
</script>
<style scoped>
#form-container {
	margin: 10px;
}

.long-title h3 {
    font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
