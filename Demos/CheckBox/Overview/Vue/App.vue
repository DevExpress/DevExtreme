<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Checked</div>
        <div class="dx-field-value">
          <DxCheckBox :value="true"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Unchecked</div>
        <div class="dx-field-value">
          <DxCheckBox :value="false"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Indeterminate</div>
        <div class="dx-field-value">
          <DxCheckBox :value="null"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Three state mode</div>
        <div class="dx-field-value">
          <DxCheckBox
            :enable-three-state-behavior="true"
            :value="null"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Handle value change</div>
        <div class="dx-field-value">
          <DxCheckBox v-model:value="checkBoxValue"/>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxCheckBox
            :disabled="true"
            :value="checkBoxValue"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Custom size</div>
        <div class="dx-field-value">
          <DxCheckBox
            :value="null"
            :icon-size="30"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With label</div>
        <div class="dx-field-value">
          <DxCheckBox
            text="Label"
            :value="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DxCheckBox } from 'devextreme-vue/check-box';

export default {
  components: {
    DxCheckBox,
  },

  data() {
    return {
      checkBoxValue: null,
    };
  },
};
</script>
