<template>
  <div id="chart-demo">
    <div class="long-title"><h3>Daily temperature</h3></div>
    <table class="demo-table">
      <tbody>
        <tr>
          <th/>
          <th>June</th>
          <th>July</th>
          <th>August</th>
        </tr>
        <tr
          v-for="week in getWeeksData"
          :key="week.weekCount"
        >
          <th>{{ week.weekCount + " week" }}</th>
          <td
            v-for="data in week.bulletsData"
            :key="data.color"
          >
            <DxBullet
              :color="data.color"
              :start-scale-value="0"
              :end-scale-value="35"
              :target="data.target"
              :value="data.value"
              class="bullet"
            >
              <DxTooltip :customize-tooltip="customizeTooltip"/>
            </DxBullet>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

import DxBullet, { DxTooltip } from 'devextreme-vue/bullet';
import { service } from './data.js';

export default {
  components: {
    DxBullet,
    DxTooltip
  },
  computed: {
    getWeeksData() {
      return service.getWeeksData();
    }
  },
  methods: {
    customizeTooltip({ value, target }) {
      return {
        text: `Current t&#176: ${value}&#176C<br>Average t&#176: ${target}&#176C`
      };
    }
  }
};
</script>
<style>
#chart-demo {
    height: 440px;
    width: 100%;
}

.demo-table {
    margin-top: 80px;
    width: 100%;
    border: 1px solid #c2c2c2;
    border-collapse: collapse;
}

.demo-table th,
.demo-table td {
    font-weight: 400;
    width: 200px;
    padding: 25px 10px 5px 10px;
    border: 1px solid #e5e5e5;
}

.demo-table th {
    padding: 25px 15px 20px 15px;
    border: 1px solid #c2c2c2;
}

.demo-table tr:nth-child(2) td {
    border-top: 1px solid #c2c2c2;
}

.demo-table td:first-of-type {
    border-left: 1px solid #c2c2c2;
}

.demo-table .bullet {
    width: 200px;
    height: 30px;
}

.long-title h3 {
    font-family: "Segoe UI Light", "Helvetica Neue Light", "Segoe UI", "Helvetica Neue", "Trebuchet MS", Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
