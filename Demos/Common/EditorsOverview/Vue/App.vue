<template>
  <div>
    <div class="settings">
      <div class="column">
        <div class="field">
          <div class="label">Title</div>
          <div class="value">
            <DxTextBox
              v-model:value="text"
              :max-length="40"
              :input-attr="{ 'aria-label': 'Title' }"
              value-change-event="keyup"
            />
          </div>
        </div>
        <div class="field">
          <div class="label">Color</div>
          <div class="value">
            <DxColorBox
              v-model:value="color"
              apply-value-mode="instantly"
              :input-attr="{ 'aria-label': 'Color' }"
            />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="label">Width</div>
          <div class="value">
            <DxNumberBox
              v-model:value="width"
              :show-spin-buttons="true"
              :max="700"
              :min="70"
              format="#0px"
              :input-attr="{ 'aria-label': 'Width' }"
            />
          </div>
        </div>
        <div class="field">
          <div class="label">Height</div>
          <div class="value">
            <DxNumberBox
              v-model:value="height"
              :show-spin-buttons="true"
              :max="700"
              :min="70"
              format="#0px"
              :input-attr="{ 'aria-label': 'Height' }"
            />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="label">Transform</div>
          <div class="value">
            <DxSelectBox
              v-model:value="transform"
              :items="transformations"
              :input-attr="{ 'aria-label': 'Transform' }"
              :grouped="true"
              display-expr="name"
              value-expr="value"
            />
          </div>
        </div>
        <div class="field">
          <div class="label">Border</div>
          <div class="value">
            <DxSwitch v-model:value="border"/>
          </div>
        </div>
      </div>
    </div>
    <SuperheroLogo
      :color="color"
      :text="text"
      :width="width"
      :height="height"
      :transform="transform"
      :border="border"
    />
  </div>
</template>
<script>

import DxTextBox from 'devextreme-vue/text-box';
import DxColorBox from 'devextreme-vue/color-box';
import DxNumberBox from 'devextreme-vue/number-box';
import DxSwitch from 'devextreme-vue/switch';
import DxSelectBox from 'devextreme-vue/select-box';

import SuperheroLogo from './SuperheroLogo.vue';

export default {
  components: {
    DxTextBox,
    DxColorBox,
    DxNumberBox,
    DxSwitch,
    DxSelectBox,
    SuperheroLogo,
  },
  data() {
    return {
      color: '#f05b41',
      text: 'UI Superhero',
      width: 370,
      height: 260,
      transform: 'scaleX(1)',
      border: false,
      transformations: [
        {
          key: 'Flip',
          items: [
            { name: '0 degrees', value: 'scaleX(1)' },
            { name: '180 degrees', value: 'scaleX(-1)' },
          ],
        },
        {
          key: 'Rotate',
          items: [
            { name: '0 degrees', value: 'rotate(0)' },
            { name: '15 degrees', value: 'rotate(15deg)' },
            { name: '30 degrees', value: 'rotate(30deg)' },
            { name: '-15 degrees', value: 'rotate(-15deg)' },
            { name: '-30 degrees', value: 'rotate(-30deg)' },
          ],
        },
      ],
    };
  },
  watch: {
    height(val) {
      this.width = (val * 37) / 26;
    },
    width(val) {
      this.height = (val * 26) / 37;
    },
  },
};
</script>
<style>
.settings {
  background-color: rgba(191, 191, 191, 0.15);
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.settings .column .field {
  padding: 5px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings .column .field .label {
  padding-right: 10px;
}

.settings .column .field .value {
  width: 155px;
}

.dx-theme-generic .settings .column .field .value .dx-switch {
  height: 36px;
}

.dx-theme-material .settings .column .field .value .dx-switch {
  height: 48px;
}

.picture-container {
  text-align: center;
  margin: 20px 2px 5px 2px;
  padding-top: 20px;
  overflow: hidden;
  outline-width: 2px;
  outline-style: none;
  outline-color: #f05b41;
}

.picture {
  transition: transform ease-in-out 400ms;
  display: inline-block;
  padding: 10px;
}

.color {
  fill: #f05b41;
}

.text {
  text-align: center;
  color: #f05b41;
  font-size: 30px;
  padding: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.dx-color-scheme-light .base-color,
.dx-color-scheme-carmine .base-color,
.dx-color-scheme-softblue .base-color {
  fill: #333;
}

.dx-color-scheme-contrast .base-color,
.dx-color-scheme-darkmoon .base-color {
  fill: #fff;
}

.dx-color-scheme-dark .base-color {
  fill: #dedede;
}

.dx-color-scheme-darkviolet .base-color {
  fill: #f5f6f7;
}

.dx-color-scheme-greenmist .base-color {
  fill: #28484f;
}
</style>
