<template>
  <div>
    <DxTreeMap
      id="treemap"
      :data-source="populationByAge"
      :layout-algorithm="currentAlgorithm"
      title="Population by Age Groups"
    >
      <DxColorizer
        :colorize-groups="true"
        type="discrete"
      />
      <DxTooltip
        :enabled="true"
        :customize-tooltip="customizeTooltip"
        format="thousands"
      />
    </DxTreeMap>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Tiling Algorithm</span>
        <DxSelectBox
          :data-source="algorithms"
          :input-attr="{ 'aria-label': 'Algorithm' }"
          :width="200"
          v-model:value="selectedAlgorithm"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import DxTreeMap,
{
  DxColorizer,
  DxTooltip,
} from 'devextreme-vue/tree-map';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { populationByAge } from './data.js';

const algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];
const selectedAlgorithm = ref(algorithms[2]);
const currentAlgorithm = computed(() => ((selectedAlgorithm.value === 'custom') ? customAlgorithm : selectedAlgorithm.value));

function customizeTooltip({ node, node: { data: { name, value } }, valueText }) {
  const parentData = node.getParent().data;

  return {
    text: node.isLeaf()
      ? `<span class='country'>${parentData.name}</span><br />${name}<br />${valueText}(${((100 * value) / parentData.total).toFixed(1)}%)`
      : `<span class='country'>${name}</span>`,
  };
}
function customAlgorithm({ rect, sum, items }) {
  const totalRect = rect.slice();
  let totalSum = sum;
  let side = 0;

  items.forEach((item) => {
    const size = Math.round(((totalRect[side + 2] - totalRect[side]) * item.value) / totalSum);
    const itemRect = totalRect.slice();

    totalSum -= item.value;
    totalRect[side] += size;
    itemRect[side + 2] = totalRect[side];
    item.rect = itemRect;
    side = 1 - side;
  });
}
</script>
<style scoped>
#treemap {
  height: 460px;
}

.country {
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
