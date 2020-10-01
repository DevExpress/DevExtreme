<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Switched on</div>
        <div class="dx-field-value">
          <DxSwitch :value="true"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Switched off</div>
        <div class="dx-field-value">
          <DxSwitch :value="false"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Value change handling</div>
        <div class="dx-field-value">
          <DxSwitch v-model:value="value"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxSwitch
            v-model:value="value"
            :disabled="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DxSwitch } from 'devextreme-vue/switch';

export default {
  components: {
    DxSwitch
  },
  data() {
    return {
      value: false
    };
  }
};
</script>
