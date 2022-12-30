<template>
  <div class="form">

    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Default Mode</div>
      <div class="dx-field">
        <div class="dx-field-label">First Name</div>
        <div class="dx-field-value">
          <DxAutocomplete
            :data-source="names"
            v-model:value="firstName"
            placeholder="Type first name..."
            @value-changed="updateEmployeeInfo"
          />
        </div>
      </div>
    </div>

    <div class="dx-fieldset">
      <div class="dx-fieldset-header">With Clear Button</div>
      <div class="dx-field">
        <div class="dx-field-label">Last Name</div>
        <div class="dx-field-value">
          <DxAutocomplete
            :data-source="surnames"
            v-model:value="lastName"
            :show-clear-button="true"
            placeholder="Type last name..."
            @value-changed="updateEmployeeInfo"
          />
        </div>
      </div>
    </div>

    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Disabled</div>
      <div class="dx-field">
        <div class="dx-field-label">Position</div>
        <div class="dx-field-value">
          <DxAutocomplete
            :data-source="positions"
            :value="position"
            :disabled="true"
          />
        </div>
      </div>
    </div>

    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Custom Item Template and Data Source Usage</div>
      <div class="dx-field">
        <div class="dx-field-label">State</div>
        <div class="dx-field-value">
          <DxAutocomplete
            :data-source="states"
            v-model:value="state"
            value-expr="State_Long"
            placeholder="Type state name..."
            item-template="stateTemplate"
            @value-changed="updateEmployeeInfo"
          >
            <template #stateTemplate="{ data }">
              <span>{{ data.State_Long }} ({{ data.State_Short }})</span>
            </template>
          </DxAutocomplete>
        </div>
      </div>
    </div>

    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Custom Store and Search Options</div>
      <div class="dx-field">
        <div class="dx-field-label">Current Client</div>
        <div class="dx-field-value">
          <DxAutocomplete
            :data-source="clientsStore"
            v-model:value="currentClient"
            :min-search-length="2"
            :search-timeout="500"
            placeholder="Type client name..."
            value-expr="Text"
            @value-changed="updateEmployeeInfo"
          />
        </div>
      </div>
    </div>

    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling</div>
      <div class="employees-data">
        Employee data: <span>{{ fullInfo }}</span>
      </div>
    </div>

  </div>
</template>
<script>
import ODataStore from 'devextreme/data/odata/store';
import { DxAutocomplete } from 'devextreme-vue/autocomplete';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import { names, surnames, positions } from './data.js';

function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}

const states = new ODataStore({
  url:
    'https://js.devexpress.com/Demos/DevAV/odata/States?$select=Sate_ID,State_Long,State_Short',
  key: 'Sate_ID',
  keyType: 'Int32',
});

const clientsStore = new CustomStore({
  key: 'Value',
  useDefaultSearch: true,
  load(loadOptions) {
    let params = '?';
    [
      'skip',
      'take',
      'filter',
    ].forEach((option) => {
      if (option in loadOptions && isNotEmpty(loadOptions[option])) {
        params += `${option}=${JSON.stringify(loadOptions[option])}&`;
      }
    });
    params = params.slice(0, -1);
    return fetch(`https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/CustomersLookup${params}`)
      .then((response) => response.json())
      .then((data) => ({
        data: data.data,
      }))
      .catch(() => { throw new Error('Data Loading Error'); });
  },
});

export default {
  components: {
    DxAutocomplete,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      position: positions[0],
      state: '',
      currentClient: '',
      fullInfo: '',

      names,
      surnames,
      positions,
      states,
      clientsStore,
    };
  },
  methods: {
    updateEmployeeInfo() {
      let fullInfo = '';
      fullInfo += `${this.firstName || ''} ${this.lastName || ''}`.trim();
      fullInfo += (fullInfo && this.position) ? `, ${this.position}` : this.position || '';
      fullInfo += (fullInfo && this.state) ? `, ${this.state}` : this.state || '';
      fullInfo += (fullInfo && this.currentClient) ? `, ${this.currentClient}` : this.currentClient || '';
      this.fullInfo = fullInfo;
    },
  },
};
</script>
<style>
.employees-data {
  padding-top: 16px;
  padding-bottom: 10px;
}
</style>
