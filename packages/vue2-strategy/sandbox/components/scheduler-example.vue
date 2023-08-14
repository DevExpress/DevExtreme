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
import { appointments } from "../../../sandbox/data";
import { DxScheduler } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxScheduler
  },
  data: function() {
    return {
      appointments: appointments,
      currentDate: new Date(2017, 4, 25)
    };
  }
};
</script>
