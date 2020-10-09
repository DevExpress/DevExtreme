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
          :width="200"
          v-model:value="selectedAlgorithm"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxTreeMap,
{
  DxColorizer,
  DxTooltip
} from 'devextreme-vue/tree-map';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { populationByAge } from './data.js';

export default {
  components: {
    DxTreeMap,
    DxColorizer,
    DxTooltip,
    DxSelectBox
  },
  data() {
    const algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];
    return {
      populationByAge,
      algorithms,
      selectedAlgorithm: algorithms[2]
    };
  },
  computed: {
    currentAlgorithm() {
      let currentAlgorithm = this.selectedAlgorithm;
      if(currentAlgorithm === 'custom') {
        currentAlgorithm = this.customAlgorithm;
      }

      return currentAlgorithm;
    }
  },
  methods: {
    customizeTooltip(arg) {
      const data = arg.node.data;
      const parentData = arg.node.getParent().data;

      return {
        text: arg.node.isLeaf()
          ? `<span class='country'>${parentData.name}</span><br />${data.name}<br />${arg.valueText}(${(100 * data.value / parentData.total).toFixed(1)}%)`
          : `<span class='country'>${data.name}</span>`
      };
    },
    customAlgorithm(arg) {
      const totalRect = arg.rect.slice();
      let totalSum = arg.sum;
      let side = 0;

      arg.items.forEach(item => {
        const size = Math.round((totalRect[side + 2] - totalRect[side]) * item.value / totalSum);
        const rect = totalRect.slice();

        totalSum -= item.value;
        rect[side + 2] = totalRect[side] = totalRect[side] + size;
        item.rect = rect;
        side = 1 - side;
      });
    }
  }
};
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
