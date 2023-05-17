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
      <div class="dx-fieldset-header">Process Value Changes</div>
      <div class="dx-field">
        <div class="dx-field-label">On handle movement</div>
        <div class="dx-field-value">
          <DxRangeSlider
            v-model:start="start"
            v-model:end="end"
            :min="0"
            :max="100"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">On handle release</div>
        <div class="dx-field-value">
          <DxRangeSlider
            v-model:start="start"
            v-model:end="end"
            :min="0"
            :max="100"
            call-value-change="onHandleRelease"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Start value</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="start"
            :min="0"
            :max="100"
            :show-spin-buttons="true"
            :input-attr="{ 'aria-label': 'Start Value' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">End value</div>
        <div class="dx-field-value">
          <DxNumberBox
            v-model:value="end"
            :min="0"
            :max="100"
            :show-spin-buttons="true"
            :input-attr="{ 'aria-label': 'End Value' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxRangeSlider from 'devextreme-vue/range-slider';
import DxNumberBox from 'devextreme-vue/number-box';

const format = (value) => `${value}%`;

export default {
  components: {
    DxRangeSlider,
    DxNumberBox,
  },
  data() {
    return {
      label: {
        visible: true,
        format,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        format,
        showMode: 'always',
        position: 'bottom',
      },
      start: 10,
      end: 90,
    };
  },
};
</script>

