<template>
  <div id="selectbox-demo">
    <div class="widget-container">
      <div class="dx-fieldset">
        <div class="dx-fieldset-header">SearchBox</div>
        <div class="dx-field">
          <div class="dx-field-label">Product</div>
          <div class="dx-field-value">
            <DxSelectBox
              :search-enabled="true"
              :data-source="products"
              :search-mode="searchModeOption"
              :search-expr="searchExprOption"
              :search-timeout="searchTimeoutOption"
              :min-search-length="minSearchLengthOption"
              :show-data-before-search="showDataBeforeSearchOption"
              display-expr="Name"
            />
          </div>
        </div>
      </div>
      <div class="dx-fieldset">
        <div class="dx-fieldset-header">EditBox</div>
        <div class="dx-field">
          <div class="dx-field-label">Product</div>
          <div class="dx-field-value">
            <DxSelectBox
              v-model:value="editBoxValue"
              :accept-custom-value="true"
              :data-source="productsDataSource"
              display-expr="Name"
              @customItemCreating="customItemCreating($event)"
            />
          </div>
        </div>
        <div class="dx-field current-product">
          Current product:
          <span
            v-if="editBoxValue"
            class="current-value"
          >
            {{ editBoxValue.Name }} (ID: {{ editBoxValue.ID }})
          </span>
          <span
            v-else
            class="current-value"
          >
            Not selected
          </span>
        </div>
      </div>
    </div>
    <div class="options">
      <div class="caption">SearchBox Options</div>
      <div class="option">
        <div>Search Mode</div>
        <DxSelectBox
          v-model:value="searchModeOption"
          :items="['contains', 'startswith']"
        />
      </div>
      <div class="option">
        <div>Search Expression</div>
        <DxSelectBox
          v-model:value="searchExprOption"
          :items="searchExprItems"
          display-expr="name"
          value-expr="value"
        />
      </div>
      <div class="option">
        <div>Search Timeout</div>
        <DxNumberBox
          v-model:value="searchTimeoutOption"
          :min="0"
          :max="5000"
          :show-spin-buttons="true"
          :step="100"
        />
      </div>
      <div class="option">
        <div>Minimum Search Length</div>
        <DxNumberBox
          v-model:value="minSearchLengthOption"
          :min="0"
          :max="5"
          :show-spin-buttons="true"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showDataBeforeSearchOption"
          text="Show Data Before Search"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { DxCheckBox } from 'devextreme-vue/check-box';
import DataSource from 'devextreme/data/data_source';

import { products, simpleProducts } from './data.js';
const productsDataSource = new DataSource({
  store: {
    data: simpleProducts,
    type: 'array',
    key: 'ID'
  }
});

export default {
  components: {
    DxSelectBox,
    DxNumberBox,
    DxCheckBox
  },
  data() {
    return {
      products,
      productsDataSource,
      editBoxValue: simpleProducts[0],
      searchModeOption: 'contains',
      searchExprOption: 'Name',
      searchTimeoutOption: 200,
      minSearchLengthOption: 0,
      showDataBeforeSearchOption: false,
      searchExprItems: [{
        name: "'Name'",
        value: 'Name'
      }, {
        name: "['Name', 'Category']",
        value: ['Name', 'Category']
      }]
    };
  },
  methods: {
    customItemCreating(data) {
      if(!data.text) {
        data.customItem = null;
        return;
      }

      const productIds = simpleProducts.map(function(item) {
        return item.ID;
      });
      const incrementedId = Math.max.apply(null, productIds) + 1;
      const newItem = {
        Name: data.text,
        ID: incrementedId
      };

      productsDataSource.store().insert(newItem);
      productsDataSource.load();
      data.customItem = newItem;
    }
  }
};
</script>
<style scoped>
    .widget-container {
        margin-right: 320px;
    }

    .current-product {
        padding-top: 11px;
    }

    .current-value {
        font-weight: bold;
    }

    .options {
        padding: 20px;
        background-color: rgba(191, 191, 191, 0.15);
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 260px;
    }

    .caption {
        font-weight: 500;
        font-size: 18px;
    }

    .option {
        margin-top: 10px;
    }
</style>
