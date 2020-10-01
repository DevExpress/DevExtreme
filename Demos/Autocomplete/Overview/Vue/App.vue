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
      <div class="dx-fieldset-header">With Custom Search Options</div>
      <div class="dx-field">
        <div class="dx-field-label">City</div>
        <div class="dx-field-value">
          <DxAutocomplete
            :data-source="cities"
            v-model:value="city"
            :min-search-length="2"
            :search-timeout="500"
            placeholder="Type two symbols to search..."
            @value-changed="updateEmployeeInfo"
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
import { names, surnames, positions, cities } from './data.js';

const states = new ODataStore({
  url:
    'https://js.devexpress.com/Demos/DevAV/odata/States?$select=Sate_ID,State_Long,State_Short',
  key: 'Sate_ID',
  keyType: 'Int32'
});

export default {
  components: {
    DxAutocomplete
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      position: positions[0],
      city: '',
      state: '',
      fullInfo:'',

      names,
      surnames,
      positions,
      cities,
      states
    };
  },
  methods: {
    updateEmployeeInfo() {
      var fullInfo = '';
      fullInfo += `${this.firstName || ''} ${this.lastName || ''}`.trim();
      fullInfo += (fullInfo && this.position) ? `, ${this.position}` : this.position;
      fullInfo += (fullInfo && this.city) ? `, ${this.city}` : this.city;
      fullInfo += (fullInfo && this.state) ? `, ${this.state}` : this.state;
      this.fullInfo = fullInfo;
    }
  }
};
</script>
<style>
.employees-data {
    padding-top: 16px;
    padding-bottom: 10px;
}
</style>
