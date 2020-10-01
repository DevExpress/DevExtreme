<template>
  <div>
    <div id="gauge-demo">
      <DxLinearGauge
        id="gauge"
        :value="value.primary"
        :subvalues="value.secondary"
      >
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="2"
        >
          <DxLabel
            :customize-text="customizeText"
          />
        </DxScale>
        <DxTooltip
          :enabled="true"
          :customize-tooltip="customizeTooltip"
        />
        <DxExport
          :enabled="true"
        />
        <DxTitle
          text="Power of Air Conditioners in Store Departments (kW)"
        >
          <DxFont
            :size="28"
          />
        </DxTitle>
      </DxLinearGauge>
      <DxSelectBox
        id="selectbox"
        :data-source="dataSource"
        v-model:value="value"
        :width="200"
        display-expr="name"
      />
    </div>
  </div>
</template>
<script>
import { dataSource } from './data.js';
import { DxLinearGauge, DxScale, DxLabel, DxTooltip, DxExport, DxTitle, DxFont } from 'devextreme-vue/linear-gauge';
import { DxSelectBox } from 'devextreme-vue/select-box';

export default {
  components: {
    DxLinearGauge, DxScale, DxLabel, DxTooltip, DxExport, DxTitle, DxFont,
    DxSelectBox
  },
  data() {
    return {
      dataSource: dataSource,
      value: dataSource[0]
    };
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} kW`;
    },
    customizeTooltip(scaleValue) {
      var result = `${scaleValue.valueText} kW`;
      if (scaleValue.index >= 0) {
        result = `Secondary ${scaleValue.index + 1}: ${result}`;
      } else {
        result = `Primary: ${result}`;
      }
      return {
        text: result
      };
    }
  }
};
</script>
<style scoped>
#gauge-demo {
    height: 440px;
    width: 100%;
}

#gauge {
    height: 400px;
}
</style>
