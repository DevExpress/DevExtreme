<template>
  <li>
    <img
      :src="employee.Picture"
      :id="'image' + employee.ID"
    ><br>
    <i>{{ employee.FirstName }} {{ employee.LastName }}</i><br>
    <DxButton
      :on-click="showEmployeeInfo"
      class="button-info"
      text="Details"
    />
  </li>
</template>
<script>
import { DxButton } from 'devextreme-vue/button';

export default {
  components: {
    DxButton
  },

  props: {
    employee: {
      type: Object,
      required: true,
      default: () => ({})
    },
    showInfo: {
      type: Function,
      required: true,
      default: () => {}
    }
  },

  methods: {
    showEmployeeInfo() {
      this.showInfo(this.employee);
    }
  }
};
</script>
