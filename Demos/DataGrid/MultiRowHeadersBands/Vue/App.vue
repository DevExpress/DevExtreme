<template>
  <DxDataGrid
    id="grid"
    :data-source="countries"
    :column-auto-width="true"
    :allow-column-reordering="true"
    :show-borders="true"
  >
    <DxColumn data-field="Country"/>
    <DxColumn
      data-field="Area"
      header-cell-template="headerTemplate"
    />
    <DxColumn caption="Population">
      <DxColumn
        caption="Total"
        data-field="Population_Total"
        format="fixedPoint"
      />
      <DxColumn
        caption="Urban"
        data-field="Population_Urban"
        format="percent"
      />
    </DxColumn>
    <DxColumn caption="Nominal GDP">
      <DxColumn
        caption="Total, mln $"
        data-field="GDP_Total"
        format="fixedPoint"
        sort-order="desc"
      />
      <DxColumn caption="By Sector">
        <DxColumn
          :width="95"
          :format="gdpFormat"
          caption="Agriculture"
          data-field="GDP_Agriculture"
        />
        <DxColumn
          :width="80"
          :format="gdpFormat"
          caption="Industry"
          data-field="GDP_Industry"
        />
        <DxColumn
          :width="85"
          :format="gdpFormat"
          caption="Services"
          data-field="GDP_Services"
        />
      </DxColumn>
    </DxColumn>
    <template #headerTemplate="{ data }">
      <div>Area, km<sup>2</sup></div>
    </template>
  </DxDataGrid>
</template>

<script>

import DxDataGrid, { DxColumn } from 'devextreme-vue/data-grid';
import { countries } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn
  },
  data() {
    return {
      countries: countries,
      gdpFormat: {
        type: 'percent',
        precision: 1
      }
    };
  }
};
</script>

<style>
#grid sup {
    font-size: 0.8em;
    vertical-align: super;
    line-height: 0;
}

.long-title h3 {
    font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
