<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      key-expr="date"
      :show-row-lines="true"
      :show-column-lines="false"
      :show-borders="true"
    >
      <DxSorting mode="none"/>
      <DxPaging :page-size="10"/>
      <DxColumn
        :width="110"
        data-field="date"
        data-type="date"
      />
      <DxColumn
        caption="Open"
        cell-template="diff-cell-template"
      />
      <DxColumn
        caption="Close"
        cell-template="diff-cell-template"
      />
      <DxColumn
        :min-width="320"
        caption="Dynamics"
        cell-template="chart-cell-template"
      />
      <DxColumn
        caption="High"
        cell-template="diff-cell-template"
      />
      <DxColumn
        caption="Low"
        cell-template="diff-cell-template"
      />
      <template #chart-cell-template="{ data }">
        <ChartCell :cell-data="data.data.dayClose"/>
      </template>
      <template #diff-cell-template="{ data }">
        <DiffCell :cell-data="data"/>
      </template>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxSorting,
  DxPaging
} from 'devextreme-vue/data-grid';

import service from './data.js';
import DiffCell from './DiffCell.vue';
import ChartCell from './ChartCell.vue';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSorting,
    DxPaging,
    DiffCell,
    ChartCell
  },
  data() {
    return {
      dataSource: service.getWeekData()
    };
  }
};
</script>
<style scoped>
#gridContainer td {
    vertical-align: middle;
}

#gridContainer .chart-cell {
    overflow: visible;
}

#gridContainer .current-value {
    display: inline-block;
}

#gridContainer .diff {
    position: relative;
    display: table-cell;
    font-size: 16px;
}

#gridContainer .inc .diff {
    color: #2ab71b;
}

#gridContainer .inc .diff:before {
    content: '+';
}

#gridContainer .dec .diff:before {
    content: '-';
}

#gridContainer .dec .diff {
    color: #f00;
}

#gridContainer .inc .diff:after,
#gridContainer .dec .diff:after {
    content: '';
    display: block;
    height: 10px;
    width: 10px;
    position: absolute;
    right: -12px;
    top: 6px;
    background-repeat: no-repeat;
    background-size: 10px 10px;
}

#gridContainer .inc .diff:after {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADKSURBVHjaYtTaLs1ABEiG0nPRJa56PEHhsxBhmCUQT4OyrwHxcXyKmQgYJgHE64CYDYrXQcXIMhCbAcgWkGzgNKh38QUB0QamIUUErkhKI9ZAGyCeTERkTYaqxWsgKA2txhdG6GGsvUNGGpeBRMUiGhCFGsqGzUBQQJsxkA5AemaiG5hDIBIIgQSgK0FmMDACs549kN5FZLjhA7+A2A2U9YSAOBeLAk4gnoBDczoOcSFGPIUDPxB/wCHHiKtwYGKgMhg1cBAaCBBgAJTUIL3ToPZfAAAAAElFTkSuQmCC');
}

#gridContainer .dec .diff:after {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADJSURBVHjaYvzPgBfgkhYA4o8QFahKmBioDEYNHIQGsgBxIBCLkqgvAYi/g1mMjMjir0EJzR6If/6HpChKMMgMe3DKBeIcKhiY8x/MYoDj+RQYNgdkGLqBbEB8kgzDToL1YjEQhKWB+BUJhj0H64Eahs1AELYhMpJ+gtUiGYbLQBBOI8LANLBaIg1kAAc0vkiAqSPBQFAkHcNi2DGoHMkGgrAENOCRI0ECRQ2JBoKwJTQCfkLZDPgMZPxPXN5NhtJzMSsJVBMAAgwAyWSY2svfmrwAAAAASUVORK5CYII=');
}
</style>
