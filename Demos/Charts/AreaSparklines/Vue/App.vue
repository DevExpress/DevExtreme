<template>
  <div>
    <h3 class="long-title">Monthly Prices of Copper, Nickel and Palladium</h3>
    <div id="chart-demo">
      <table
        class="demo-table"
        border="1"
      >
        <tr>
          <th/>
          <th>Copper (USD/ton)</th>
          <th>Nickel (USD/ton)</th>
          <th>Palladium (USD/troy ounce)</th>
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

<script>
import RowTemplate from './RowTemplate.vue';

export default {
  components: {
    RowTemplate
  },

  data() {
    return {
      years: ['2010', '2011', '2012']
    };
  }
};
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
    padding: 25px 10px 5px 10px;
    border: 1px solid #c2c2c2;
    padding: 25px 15px 20px 15px;
    border: 1px solid #c2c2c2;
}

h3.long-title {
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 0px;
}
</style>
