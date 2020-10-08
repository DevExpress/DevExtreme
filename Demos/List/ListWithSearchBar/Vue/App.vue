<template>
  <div>
    <div class="list-container">
      <DxList
        :data-source="products"
        :height="400"
        :search-enabled="true"
        :search-mode="searchMode"
        search-expr="Name"
      >
        <template #item="{ data }">
          <div>
            <div>{{ data.Name }}</div>
          </div>
        </template>
      </DxList>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Search mode </span>
        <DxSelectBox
          :items="['contains', 'startsWith']"
          v-model:value="searchMode"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxSelectBox from 'devextreme-vue/select-box';
import DxList from 'devextreme-vue/list';

import { products } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxList
  },
  data() {
    return {
      products,
      searchMode: 'contains'
    };
  }
};
</script>
<style>
.dx-list-item-content > div {
    padding: 5px;
    font-size: 15px;
}

.options {
    margin-top: 20px;
    padding: 20px;
    background: rgba(191, 191, 191, 0.15);
}

.options .caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.option > span {
    margin-right: 10px;
}

.option > .dx-selectbox {
    display: inline-block;
    vertical-align: middle;
    max-width: 350px;
    width: 100%;
}

</style>
