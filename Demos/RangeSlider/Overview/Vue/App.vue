<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Default mode</div>
        <div class="dx-field-value">
          <DxRangeSlider
            :min="0"
            :max="100"
            :start="20"
            :end="60"
          />
        </div>
      </div>
      <div class="dx-field custom-height-slider">
        <div class="dx-field-label">With labels</div>
        <div class="dx-field-value">
          <DxRangeSlider
            :min="0"
            :max="100"
            :start="35"
            :end="65"
            :label="label"
          />
        </div>
      </div>
      <div class="dx-field custom-height-slider">
        <div class="dx-field-label">With tooltips</div>
        <div class="dx-field-value">
          <DxRangeSlider
            :min="0"
            :max="100"
            :start="15"
            :end="65"
            :tooltip="tooltip"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Without range highlighting</div>
        <div class="dx-field-value">
          <DxRangeSlider
            :min="0"
            :max="100"
            :start="20"
            :end="80"
            :show-range="false"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With discrete step</div>
        <div class="dx-field-value">
          <DxRangeSlider
            :min="0"
            :max="100"
            :start="20"
            :end="70"
            :step="10"
            :tooltip="{enabled: true}"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxRangeSlider
            :min="0"
            :max="100"
            :start="25"
            :end="75"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling and API</div>
      <div class="dx-field">
        <DxRangeSlider
          :min="0"
          :max="100"
          v-model:value="range"
        />
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Start value</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="range[0]"
            :min="0"
            :max="100"
            :show-spin-buttons="true"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">End value</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="range[1]"
            :min="0"
            :max="100"
            :show-spin-buttons="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxRangeSlider from 'devextreme-vue/range-slider';
import DxNumberBox from 'devextreme-vue/number-box';

const format = value => `${value}%`;

export default {
  components: {
    DxRangeSlider,
    DxNumberBox
  },
  data() {
    return {
      label: {
        visible: true,
        format,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        format,
        showMode: 'always',
        position: 'bottom'
      },
      range: [10, 90]
    };
  }
};
</script>

