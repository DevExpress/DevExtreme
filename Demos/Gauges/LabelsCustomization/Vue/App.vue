<template>
  <div>
    <DxBarGauge
      id="gauge"
      :start-value="0"
      :end-value="100"
      :values="values"
    >
      <DxLabel
        :indent="30"
        :format="format"
        :customize-text="customizeText"
      />
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Series' Ratings"
      >
        <DxFont
          :size="28"
        />
      </DxTitle>
    </DxBarGauge>
  </div>
</template>
<script>
import { DxBarGauge, DxLabel, DxExport, DxTitle, DxFont } from 'devextreme-vue/bar-gauge';

export default {
  components: {
    DxBarGauge, DxLabel, DxExport, DxTitle, DxFont
  },
  data() {
    return {
      values: [47.27, 65.32, 84.59, 71.86],
      format: {
        type: 'fixedPoint',
        precision: 1
      }
    };
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} %`;
    }
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
