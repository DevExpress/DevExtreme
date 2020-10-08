<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">
        Multi-tag for several items
      </div>
      <div class="dx-field-value">
        <DxTagBox
          :items="products"
          :value="[1, 2, 3, 4]"
          :show-selection-controls="true"
          :max-displayed-tags="3"
          display-expr="Name"
          value-expr="Id"
          select-all-mode="allPages"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">
        Multi-tag for all items
      </div>
      <div class="dx-field-value">
        <DxTagBox
          :items="items"
          :value="[1, 2, 3, 4, 5]"
          :show-selection-controls="true"
          :max-displayed-tags="3"
          display-expr="Name"
          value-expr="Id"
          @multiTagPreparing="onMultiTagPreparing"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">
        Multi-tag with ordinary tags
      </div>
      <div class="dx-field-value">
        <DxTagBox
          :items="products"
          :value="[1, 2, 3, 4, 5, 6, 7]"
          :show-selection-controls="true"
          :max-displayed-tags="2"
          :show-multi-tag-only="false"
          display-expr="Name"
          value-expr="Id"
          select-all-mode="allPages"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxTagBox from 'devextreme-vue/tag-box';
import { products } from './data.js';

export default {
  components: {
    DxTagBox
  },
  data() {
    return {
      products,
      items: products.slice(0, 5),
      onMultiTagPreparing: (args) => {
        const selectedItemsLength = args.selectedItems.length;
        const totalCount = 5;

        if(selectedItemsLength < totalCount) {
          args.cancel = true;
        } else {
          args.text = `All selected (${ selectedItemsLength })`;
        }
      }
    };
  }
};
</script>
<style scoped>
.dx-field {
    margin-bottom: 50px;
}
</style>
