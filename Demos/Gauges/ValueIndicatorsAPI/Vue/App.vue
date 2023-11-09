<template>
  <div>
    <div id="gauge-demo">
      <div class="widget-container">
        <DxCircularGauge
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
            :input-attr="{ 'aria-label': 'Main Generator' }"
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
            :input-attr="{ 'aria-label': 'Additional Generator One' }"
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
            :input-attr="{ 'aria-label': 'Additional Generator Two' }"
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
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  DxCircularGauge, DxScale, DxLabel, DxTooltip, DxTitle, DxFont,
} from 'devextreme-vue/circular-gauge';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { DxButton } from 'devextreme-vue/button';

const additionalGenerator1Value = ref(12);
const additionalGenerator2Value = ref(23);
const mainGeneratorValue = ref(34);
const gauge = ref();
const customizeText = ({ valueText }) => `${valueText} kV`;

onMounted(() => {
  updateValues();
});
function updateValues() {
  gauge.value.instance.value(mainGeneratorValue.value);
  gauge.value.instance.subvalues([
    additionalGenerator1Value.value,
    additionalGenerator2Value.value,
  ]);
}
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#edit {
  margin-left: auto;
}
</style>
