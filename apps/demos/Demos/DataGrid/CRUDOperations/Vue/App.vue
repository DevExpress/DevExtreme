<template>
  <div>
    <DxDataGrid
      id="grid"
      :show-borders="true"
      :data-source="ordersData"
      :repaint-changes-only="true"
    >
      <DxEditing
        :refresh-mode="refreshMode"
        :allow-adding="true"
        :allow-updating="true"
        :allow-deleting="true"
        mode="cell"
      />
      <DxColumn
        data-field="CustomerID"
        caption="Customer"
      >
        <DxLookup
          :data-source="customersData"
          value-expr="Value"
          display-expr="Text"
        />
      </DxColumn>
      <DxColumn
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn data-field="Freight"/>
      <DxColumn data-field="ShipCountry"/>
      <DxColumn
        data-field="ShipVia"
        caption="Shipping Company"
        data-type="number"
      >
        <DxLookup
          :data-source="shippersData"
          value-expr="Value"
          display-expr="Text"
        />
      </DxColumn>
      <DxScrolling mode="virtual"/>
      <DxSummary>
        <DxTotalItem
          column="CustomerID"
          summary-type="count"
        />
        <DxTotalItem
          column="Freight"
          summary-type="sum"
          value-format="#0.00"
        />
      </DxSummary>
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Refresh Mode: </span>
        <DxSelectBox
          v-model:value="refreshMode"
          :input-attr="{ 'aria-label': 'Refresh Mode' }"
          :items="refreshModes"
        />
      </div>
      <div id="requests">
        <div>
          <div class="caption">Network Requests</div>
          <DxButton
            id="clear"
            text="Clear"
            @click="clearRequests"
          />
        </div>
        <ul>
          <li
            v-for="(request, index) in requests"
            :key="index"
          >{{ request }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxScrolling,
  DxSummary,
  DxLookup,
  DxTotalItem,
} from 'devextreme-vue/data-grid';
import { DxButton } from 'devextreme-vue/button';
import { DxSelectBox } from 'devextreme-vue/select-box';
import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';
import 'whatwg-fetch';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const ordersData = new CustomStore({
  key: 'OrderID',
  load: () => sendRequest(`${URL}/Orders`),
  insert: (values) => sendRequest(`${URL}/InsertOrder`, 'POST', {
    values: JSON.stringify(values),
  }),
  update: (key, values) => sendRequest(`${URL}/UpdateOrder`, 'PUT', {
    key,
    values: JSON.stringify(values),
  }),
  remove: (key) => sendRequest(`${URL}/DeleteOrder`, 'DELETE', {
    key,
  }),
});

const customersData = new CustomStore({
  key: 'Value',
  loadMode: 'raw',
  load: () => sendRequest(`${URL}/CustomersLookup`),
});

const shippersData = new CustomStore({
  key: 'Value',
  loadMode: 'raw',
  load: () => sendRequest(`${URL}/ShippersLookup`),
});

const refreshModes = ['full', 'reshape', 'repaint'];

const requests = ref<string[]>([]);
const refreshMode = ref('reshape');

const sendRequest = async(url: string, method = 'GET', data: Record<string, string> = {}) => {
  logRequest(method, url, data);

  const request: any = {
    method, credentials: 'include',
  };

  if (['DELETE', 'POST', 'PUT'].includes(method)) {
    const params = Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');

    request.body = params;
    request.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
  }

  const response = await fetch(url, request);

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const result = isJson ? await response.json() : {};

  if (!response.ok) {
    throw result.Message;
  }

  return method === 'GET' ? result.data : {};
};

const logRequest = (method: string, url: string, data: Record<string, string>) => {
  const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');

  const time = formatDate(new Date(), 'HH:mm:ss');

  requests.value.unshift([time, method, url.slice(URL.length), args].join(' '));
};

const clearRequests = () => {
  requests.value = [];
};
</script>
<style scoped>
#grid {
  height: 440px;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-bottom: 10px;
}

.option > span {
  position: relative;
  top: 2px;
  margin-right: 10px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}

#requests .caption {
  float: left;
  padding-top: 7px;
}

#requests > div {
  padding-bottom: 5px;
}

#requests > div::after {
  content: "";
  display: table;
  clear: both;
}

#requests #clear {
  float: right;
}

#requests ul {
  list-style: none;
  max-height: 100px;
  overflow: auto;
  margin: 0;
}

#requests ul li {
  padding: 7px 0;
  border-bottom: 1px solid #ddd;
}

#requests ul li:last-child {
  border-bottom: none;
}
</style>
