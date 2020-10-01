<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Default mode</div>
        <div class="dx-field-value">
          <DxSlider
            :min="0"
            :max="100"
            :value="90"
          />
        </div>
      </div>
      <div class="dx-field custom-height-slider">
        <div class="dx-field-label">With labels</div>
        <div class="dx-field-value">
          <DxSlider
            :min="0"
            :max="100"
            :value="50"
            :label="label"
          />
        </div>
      </div>
      <div class="dx-field custom-height-slider">
        <div class="dx-field-label">With tooltip</div>
        <div class="dx-field-value">
          <DxSlider
            :min="0"
            :max="100"
            :value="35"
            :tooltip="tooltip"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Without range highlighting</div>
        <div class="dx-field-value">
          <DxSlider
            :min="0"
            :max="100"
            :value="20"
            :show-range="false"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With discrete step</div>
        <div class="dx-field-value">
          <DxSlider
            :min="0"
            :max="100"
            :value="10"
            :step="10"
            :tooltip="{ enabled: true }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxSlider
            :min="0"
            :max="100"
            :value="50"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling and API</div>
      <div class="dx-field">
        <DxSlider
          v-model:value="sliderValue"
          :min="0"
          :max="100"
        />
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Slider value</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="sliderValue"
            :min="0"
            :max="100"
            :value="10"
            :show-spin-buttons="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DxSlider } from 'devextreme-vue/slider';
import { DxNumberBox } from 'devextreme-vue/number-box';

const format = value => `${value}%`;

export default {
  components: {
    DxSlider,
    DxNumberBox
  },
  data() {
    return {
      sliderValue: 10,
      label: {
        visible: true,
        position: 'top',
        format
      },
      tooltip: {
        enabled: true,
        showMode: 'always',
        position: 'bottom',
        format
      }
    };
  }
};
</script>
<style scoped>
.custom-height-slider {
  height: 75px;
}

.dx-field .dx-slider {
  flex: 1;
}
</style>
