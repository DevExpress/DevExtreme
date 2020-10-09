<template>
  <div>
    <DxPieChart
      :data-source="dataSource"
      :resolve-label-overlapping="resolveMode"
      palette="Bright"
      title="Olympic Medals in 2008"
    >
      <DxSeries
        argument-field="country"
        value-field="medals"
      >
        <DxLabel
          :visible="true"
          :customize-text="formatText"
        />
      </DxSeries>
      <DxMargin :bottom="20"/>
      <DxExport :enabled="true"/>
      <DxLegend :visible="false"/>
      <DxAnimation :enabled="false"/>
    </DxPieChart>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Label Overlapping Resolution Mode</span>
        <DxSelectBox
          :data-source="resolveModes"
          v-model:value="resolveMode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DxPieChart, {
  DxSeries,
  DxLabel,
  DxMargin,
  DxExport,
  DxLegend,
  DxAnimation
} from 'devextreme-vue/pie-chart';
import DxSelectBox from 'devextreme-vue/select-box';

import { dataSource } from './data.js';

export default {
  components: {
    DxPieChart,
    DxSeries,
    DxLabel,
    DxMargin,
    DxExport,
    DxLegend,
    DxAnimation,
    DxSelectBox
  },
  data() {
    return {
      dataSource,
      resolveModes: ['shift', 'hide', 'none'],
      resolveMode: 'shift'
    };
  },
  methods: {
    formatText(pointInfo) {
      return `${pointInfo.argumentText} (${pointInfo.percentText})`;
    }
  }
};
</script>

<style>
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
