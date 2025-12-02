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
            :input-attr="{ 'aria-label': 'Position' }"
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
            value-expr="Name"
            placeholder="Type state name..."
            item-template="stateTemplate"
            @value-changed="updateEmployeeInfo"
          >
            <template #stateTemplate="{ data }">
              <span>{{ data.Name }} ({{ data.Short }})</span>
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
<script setup lang="ts">
import { ref } from 'vue';
import { CustomStore, type LoadOptions } from 'devextreme-vue/common/data';
import { DxAutocomplete } from 'devextreme-vue/autocomplete';
import 'whatwg-fetch';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { names, surnames, positions } from './data.ts';

const statesStore = createStore({
  loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridStatesLookup',
  key: 'ID',
});

const clientsCustomStore = new CustomStore({
  key: 'Value',
  useDefaultSearch: true,
  load(loadOptions: LoadOptions) {
    let params = '?';
    const options: Array<keyof LoadOptions> = [
      'skip',
      'take',
      'filter',
    ];

    options.forEach((option) => {
      if (option in loadOptions && isNotEmpty(loadOptions[option])) {
        params += `${option}=${JSON.stringify(loadOptions[option])}&`;
      }
    });

    params = params.slice(0, -1);
    return fetch(`https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/CustomersLookup${params}`)
      .then((response) => response.json())
      .then((data) => ({
        data: data.data,
      }))
      .catch(() => { throw new Error('Data Loading Error'); });
  },
});

const firstName = ref('');
const lastName = ref('');
const position = ref(positions[0]);
const state = ref('');
const currentClient = ref('');
const fullInfo = ref('');
const states = ref(statesStore);
const clientsStore = ref(clientsCustomStore);

function updateEmployeeInfo() {
  let employeeInfo = '';
  employeeInfo += `${firstName.value || ''} ${lastName.value || ''}`.trim();
  employeeInfo += (employeeInfo && position) ? `, ${position.value}` : position.value || '';
  employeeInfo += (employeeInfo && state.value) ? `, ${state.value}` : state.value || '';
  employeeInfo += (employeeInfo && currentClient.value) ? `, ${currentClient.value}` : currentClient.value || '';
  fullInfo.value = employeeInfo;
}
function isNotEmpty(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}
</script>
<style>
.employees-data {
  padding-top: 16px;
  padding-bottom: 10px;
}
</style>
