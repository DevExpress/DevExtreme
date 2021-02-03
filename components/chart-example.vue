<template>
  <example-block title="dxChart">
    <dx-chart
    :dataSource="chartData"
    :series="series"
    />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { orangesByDay } from "../data";
import { DxChart } from "devextreme-vue";

export default {
  components: {
    ExampleBlock,
    DxChart
  },
  data() {
    return {
      chartData: orangesByDay,
      series: [
        {
          argumentField: "day",
          valueField: "oranges",
          name: "My oranges",
          type: "line"
        }
      ]
    };
  }
};
</script>
