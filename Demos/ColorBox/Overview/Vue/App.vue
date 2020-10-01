<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Default mode</div>
        <div class="dx-field-value">
          <DxColorBox
            value="#f05b41"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With alpha channel editing</div>
        <div class="dx-field-value">
          <DxColorBox
            :edit-alpha-channel="true"
            value="#f05b41"
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
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Read only</div>
        <div class="dx-field-value">
          <DxColorBox
            :read-only="true"
            value="#f05b41"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxColorBox
            :disabled="true"
            value="#f05b41"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling</div>
      <div class="hero-block">
        <div
          :style="{ backgroundColor: color }"
          class="color-block"
        >
          <div class="superhero"/>
        </div>
        <div class="hero-color-box">
          <DxColorBox
            v-model:value="color"
            apply-value-mode="instantly"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DxColorBox from 'devextreme-vue/color-box';

export default {
  components: {
    DxColorBox
  },
  data: function() {
    return {
      color: '#f05b41'
    };
  }
};
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
    background-color: #f05b41;
    position: relative;
}
.hero-color-box{
    position: absolute;
    right: 0;
    left: 400px;
    top: 110px;
}
.color-block .superhero{
    position: absolute;
    height: 100%;
    width: 100%;
}
.hero-block {
    position: relative;
}
.superhero {
    background-image: url(../../../../images/hero_white.png);
}
.dx-color-scheme-dark .superhero {
    background-image: url(../../../../images/hero_black.png);
}
.dx-color-scheme-darkmoon .superhero {
    background-image: url(../../../../images/hero_darkmoon.png);
}
.dx-color-scheme-darkviolet .superhero {
    background-image: url(../../../../images/hero_darkviolet.png);
}
.dx-color-scheme-greenmist .superhero {
    background-image: url(../../../../images/hero_greenmist.png);
}
.dx-color-scheme-contrast .superhero {
    background-image: url(../../../../images/hero_contrast.png);
}
.dx-color-scheme-blue-dark .superhero,
.dx-color-scheme-orange-dark .superhero,
.dx-color-scheme-teal-dark .superhero,
.dx-color-scheme-lime-dark .superhero,
.dx-color-scheme-purple-dark .superhero {
    background-image: url(../../../../images/hero_material_dark.png);
}
</style>
