<template>
  <div>
    <DxBarGauge
      id="gauge"
      :start-value="startValue"
      :end-value="50"
      :base-value="0"
      :values="values"
      palette="Ocean"
    >
      <DxLabel
        :customize-text="customizeText"
      />
      <DxExport
        :enabled="true"
      />
      <DxTitle
        text="Deviations in the Manufactured Parts"
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
      startValue: -50,
      values: [-21.3, 14.8, -30.9, 45.2]
    };
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} mm`;
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
