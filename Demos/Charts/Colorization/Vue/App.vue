<template>
  <div>
    <DxTreeMap
      id="treemap"
      :data-source="salesAmount"
      :colorizer="typeOptions"
      value-field="salesAmount"
      title="Sales Amount by Product"
    >
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
        format="currency"
      />
    </DxTreeMap>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Colorization Type</span>
        <DxSelectBox
          :data-source="colorizationOptions"
          :width="200"
          v-model:value="typeOptions"
          display-expr="name"
          value-expr="options"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxTreeMap,
{
  DxTooltip
} from 'devextreme-vue/tree-map';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { salesAmount, colorizationOptions } from './data.js';

export default {
  components: {
    DxTreeMap,
    DxTooltip,
    DxSelectBox
  },
  data() {
    return {
      salesAmount,
      colorizationOptions,
      typeOptions: colorizationOptions[2].options
    };
  },
  methods: {
    customizeTooltip(arg) {
      const data = arg.node.data;

      return {
        text: arg.node.isLeaf() ? `<span class='product'>${data.name}</span><br/>Sales Amount: ${arg.valueText}` : null
      };
    }
  }
};
</script>
<style scoped>
.product {
    font-weight: 500;
}

.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
}

.option {
    margin-top: 10px;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option > span {
    margin-right: 14px;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
}
</style>
