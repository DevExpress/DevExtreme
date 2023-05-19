<template>
  <div>
    <div class="long-title"><h3>Monthly Prices of Aluminium, Nickel and Copper</h3></div>
    <div id="chart-demo">
      <table
        class="demo-table"
        border="1"
      >
        <tr>
          <th/>
          <th>Aluminium (USD/ton)</th>
          <th>Nickel (USD/ton)</th>
          <th>Copper (USD/ton)</th>
        </tr>
        <tbody
          v-for="(year, index) in years"
          :key="index"
        >
          <RowTemplate
            :source="source"
            :year="year"
          />
        </tbody>
      </table>
      <div class="action">
        <div class="label">Choose a number of months:
        </div>
        <DxSelectBox
          id="choose-months"
          :data-source="months"
          :input-attr="{ 'aria-label': 'Month' }"
          :value="months[0]"
          @value-changed="onValueChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DxSelectBox from 'devextreme-vue/select-box';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import RowTemplate from './RowTemplate.vue';

const source = new DataSource({
  store: new CustomStore({
    load: () => fetch('../../../../data/resourceData.json')
      .then((e) => e.json())
      .catch(() => { throw new Error('Data Loading Error'); }),
    loadMode: 'raw',
  }),
  filter: ['month', '<=', '12'],
  paginate: false,
});

export default {
  components: {
    RowTemplate,
    DxSelectBox,
  },
  data() {
    return {
      months: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      years: ['2010', '2011', '2012'],
      source,
    };
  },
  methods: {
    onValueChanged(e) {
      this.source.filter(['month', '<=', e.value]);
      this.source.load();
    },
  },
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

.demo-table th,
.demo-table td {
  font-weight: 400;
  width: 200px;
  padding: 25px 10px 5px 10px;
  border: 1px solid #c2c2c2;
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

.demo-table .sparkline {
  width: 200px;
  height: 30px;
}

.action {
  width: 300px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action .dx-selectbox {
  width: 90px;
}

.long-title h3 {
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0;
}
</style>
