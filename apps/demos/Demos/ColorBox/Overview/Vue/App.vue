<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Default mode</div>
        <div class="dx-field-value">
          <DxColorBox
            value="#f05b41"
            :input-attr="defaultModeLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With alpha channel editing</div>
        <div class="dx-field-value">
          <DxColorBox
            :edit-alpha-channel="true"
            value="#f05b41"
            :input-attr="alphaChannelLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Custom button captions</div>
        <div class="dx-field-value">
          <DxColorBox
            value="#f05b41"
            apply-button-text="Apply"
            cancel-button-text="Decline"
            :input-attr="customButtonCaptionsLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Read only</div>
        <div class="dx-field-value">
          <DxColorBox
            :read-only="true"
            value="#f05b41"
            :input-attr="readOnlyLabel"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxColorBox
            :disabled="true"
            value="#f05b41"
            :input-attr="disabledLabel"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling</div>
      <div class="hero-block">
        <div class="color-block">
          <svg
            class="brush"
            width="360"
            height="254"
            :style="{ color }"
          >
            <use :href='"../../../../images/Brush.svg#brush"'/>
          </svg>
          <svg
            class="superhero dx-color-icon"
            width="360"
            height="254"
          >
            <use :href='"../../../../images/Hero.svg#hero"'/>
          </svg>
        </div>
        <div class="hero-color-box">
          <DxColorBox
            v-model:value="color"
            apply-value-mode="instantly"
            :input-attr="eventHandlingLabel"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxColorBox from 'devextreme-vue/color-box';

const color = ref('#f05b41');

const defaultModeLabel = { 'aria-label': 'Default mode' };
const alphaChannelLabel = { 'aria-label': 'With alpha channel editing' };
const customButtonCaptionsLabel = { 'aria-label': 'Custom button captions' };
const readOnlyLabel = { 'aria-label': 'Read only' };
const disabledLabel = { 'aria-label': 'Disabled' };
const eventHandlingLabel = { 'aria-label': 'Event Handling' };
</script>
<style>
.form {
  min-height: 690px;
}

.form .dx-field-value {
  text-align: right;
}

.dx-fieldset-header {
  padding: 10px 0;
}

.color-block {
  width: 360px;
  height: 254px;
  position: relative;
}

.hero-color-box {
  position: absolute;
  right: 0;
  left: 400px;
  top: 110px;
}

.superhero,
.brush {
  position: absolute;
  height: 100%;
  width: 100%;
}

.hero-block {
  position: relative;
}

.brush {
  color: #f05b41;
}
</style>
