<template>
  <div v-if="connectionStarted">
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :repaint-changes-only="true"
      :highlight-changes="true"
      :show-borders="true"
    >
      <DxColumn
        :width="115"
        data-field="lastUpdate"
        data-type="date"
        format="longTime"
      />
      <DxColumn
        data-field="symbol"
      />
      <DxColumn
        data-field="price"
        data-type="number"
        format="#0.####"
        cell-template="priceCellTemplate"
      />
      <DxColumn
        :width="140"
        data-field="change"
        data-type="number"
        format="#0.####"
        cell-template="changeCellTemplate"
      />
      <DxColumn
        data-field="dayOpen"
        data-type="number"
        format="#0.####"
      />
      <DxColumn
        data-field="dayMin"
        data-type="number"
        format="#0.####"
      />
      <DxColumn
        data-field="dayMax"
        data-type="number"
        format="#0.####"
      />
      <template #priceCellTemplate="{ data: cellData }">
        <PriceCell :cell-data="cellData"/>
      </template>
      <template #changeCellTemplate="{ data: cellData }">
        <ChangeCell :cell-data="cellData"/>
      </template>
    </DxDataGrid>
  </div>
</template>
<script>

import {
  DxDataGrid,
  DxColumn
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { HubConnectionBuilder } from '@aspnet/signalr';

import PriceCell from './PriceCell.vue';
import ChangeCell from './ChangeCell.vue';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    PriceCell,
    ChangeCell
  },
  data() {
    return {
      connectionStarted: false,
      dataSource: null
    };
  },
  mounted() {
    var hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub')
      .build();

    var store = new CustomStore({
      load: () => hubConnection.invoke('getAllStocks'),
      key: 'symbol'
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data) => {
          store.push([{ type: 'update', key: data.symbol, data: data }]);
        });
        this.dataSource = store;
        this.connectionStarted = true;
      });
  }
};
</script>

<style>
#gridContainer span.current-value {
    display: inline-block;
    margin-right: 5px;
}

#gridContainer span.diff {
    width: 50px;
    display: inline-block;
}

#gridContainer .inc {
    color: #2ab71b;
}

#gridContainer .dec {
    color: #f00;
}

#gridContainer .inc .arrow,
#gridContainer .dec .arrow {
    display: inline-block;
    height: 10px;
    width: 10px;
    background-repeat: no-repeat;
    background-size: 10px 10px;
}

#gridContainer .inc .arrow {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADKSURBVHjaYtTaLs1ABEiG0nPRJa56PEHhsxBhmCUQT4OyrwHxcXyKmQgYJgHE64CYDYrXQcXIMhCbAcgWkGzgNKh38QUB0QamIUUErkhKI9ZAGyCeTERkTYaqxWsgKA2txhdG6GGsvUNGGpeBRMUiGhCFGsqGzUBQQJsxkA5AemaiG5hDIBIIgQSgK0FmMDACs549kN5FZLjhA7+A2A2U9YSAOBeLAk4gnoBDczoOcSFGPIUDPxB/wCHHiKtwYGKgMhg1cBAaCBBgAJTUIL3ToPZfAAAAAElFTkSuQmCC');
}

#gridContainer .dec .arrow {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADJSURBVHjaYvzPgBfgkhYA4o8QFahKmBioDEYNHIQGsgBxIBCLkqgvAYi/g1mMjMjir0EJzR6If/6HpChKMMgMe3DKBeIcKhiY8x/MYoDj+RQYNgdkGLqBbEB8kgzDToL1YjEQhKWB+BUJhj0H64Eahs1AELYhMpJ+gtUiGYbLQBBOI8LANLBaIg1kAAc0vkiAqSPBQFAkHcNi2DGoHMkGgrAENOCRI0ECRQ2JBoKwJTQCfkLZDPgMZPxPXN5NhtJzMSsJVBMAAgwAyWSY2svfmrwAAAAASUVORK5CYII=');
}
</style>
