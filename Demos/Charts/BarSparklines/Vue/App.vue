<template>
  <div>
    <h3 class="long-title">Monthly Prices of Aluminium, Nickel and Copper</h3>
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
        <DxSelectBox
          id="choose-months"
          :data-source="months"
          :width="70"
          :value="months[0]"
          @value-changed="onValueChanged"
        />
        <div class="label">Choose a number of months:
        </div>
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
    load: () => {
      return fetch('../../../../data/resourceData.json')
        .then(e => e.json())
        .catch(() => { throw 'Data Loading Error'; });
    },
    loadMode: 'raw'
  }),
  filter: ['month', '<=', '12'],
  paginate: false
});

export default {
  components: {
    RowTemplate,
    DxSelectBox
  },
  data() {
    return {
      months: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      years: ['2010', '2011', '2012'],
      source
    };
  },
  methods:{
    onValueChanged(e) {
      this.source.filter(['month', '<=', e.value]);
      this.source.load();
    }
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

#choose-months {
    float: right;
}
.action {
    width: 270px;
    margin-top: 20px;
}
.label {
    padding-top: 9px;
}

h3.long-title {
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 0px;
}
</style>
