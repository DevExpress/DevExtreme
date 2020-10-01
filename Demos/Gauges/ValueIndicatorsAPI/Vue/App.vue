<template>
  <div>
    <div id="gauge-demo">
      <div class="widget-container">
        <DxCircularGauge
          id="gauge"
          ref="gauge"
        >
          <DxScale
            :start-value="10"
            :end-value="40"
            :tick-interval="5"
          >
            <DxLabel
              :customize-text="customizeText"
            />
          </DxScale>
          <DxTooltip
            :enabled="true"
          />
          <DxTitle
            text="Generators Voltage (kV)"
          >
            <DxFont
              :size="28"
            />
          </DxTitle>
        </DxCircularGauge>
      </div>
      <div class="options">
        <div class="caption">Options</div>
        <div class="option">
          <span>Main generator</span>
          <DxNumberBox
            id="main-generator"
            v-model:value="mainGeneratorValue"
            :min="10"
            :max="40"
            :width="100"
            :show-spin-buttons="true"
          />
        </div>
        <div class="option">
          <span>Additional generator 1</span>
          <DxNumberBox
            id="additional-generator-one"
            v-model:value="additionalGenerator1Value"
            :min="10"
            :max="40"
            :width="100"
            :show-spin-buttons="true"
          />
        </div>
        <div class="option">
          <span>Additional generator 2</span>
          <DxNumberBox
            id="additional-generator-two"
            v-model:value="additionalGenerator2Value"
            :min="10"
            :max="40"
            :width="100"
            :show-spin-buttons="true"
          />
        </div>
        <div class="option">
          <DxButton
            id="edit"
            :width="100"
            text="Apply"
            @click="updateValues"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DxCircularGauge, DxScale, DxLabel, DxTooltip, DxTitle, DxFont } from 'devextreme-vue/circular-gauge';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { DxButton } from 'devextreme-vue/button';

export default {
  components: {
    DxCircularGauge, DxScale, DxLabel, DxTooltip, DxTitle, DxFont,
    DxNumberBox,
    DxButton
  },
  data() {
    return {
      additionalGenerator1Value: 12,
      additionalGenerator2Value: 23,
      mainGeneratorValue: 34
    };
  },
  mounted() {
    this.updateValues();
  },
  methods: {
    customizeText({ valueText }) {
      return `${valueText} kV`;
    },
    updateValues() {
      this.$refs.gauge.instance.value(this.mainGeneratorValue);
      this.$refs.gauge.instance.subvalues([this.additionalGenerator1Value, this.additionalGenerator2Value]);
    }
  }
};
</script>
<style scoped>
.widget-container {
    margin-right: 320px;
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
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.option > span {
    width: 155px;
    line-height: 36px;
}

.option > .dx-widget {
    float: right;
}
</style>
