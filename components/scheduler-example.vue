<template>
  <example-block title="dxScheduler">
    <dx-scheduler
      currentView="week"
      :dataSource="appointments"
      :height="400"
      :currentDate="currentDate"
      :startDayHour="9"
      :views="['month', 'week', 'day']"
    />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { appointments } from "../data";
import { DxScheduler } from "devextreme-vue";

export default {
  components: {
    ExampleBlock,
    DxScheduler
  },
  data() {
    return {
      appointments: appointments,
      currentDate: new Date(2017, 4, 25)
    };
  }
};
</script>
