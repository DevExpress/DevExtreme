<template>
  <div>
    <div class="long-title"><h3>Monthly Prices of Oil, Gold and Silver</h3></div>
    <div id="chart-demo">
      <table class="demo-table">
        <tr>
          <th/>
          <th>Oil (USD/barrel)</th>
          <th>Gold (USD/troy ounce)</th>
          <th>Silver (USD/troy ounce)</th>
        </tr>
        <tbody
          v-for="(year, index) in years"
          :key="index"
        >
          <RowTemplate :year="year"/>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import RowTemplate from './RowTemplate.vue';

const years = ['2010', '2011', '2012'];
</script>
<style>
#chart-demo {
  height: 440px;
}

.demo-table {
  width: 100%;
  border: 1px solid #c2c2c2;
  border-collapse: collapse;
}

.demo-table th {
  font-weight: 400;
  width: 200px;
  padding: 25px 15px 20px 15px;
  border: 1px solid #c2c2c2;
}

.long-title h3 {
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0;
}
</style>
