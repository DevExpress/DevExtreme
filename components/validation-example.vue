<template>
  <example-block title="Validation" >
    <dx-validation-group>
      <dx-text-box value="email@mail.com">
        <dx-validator>
          <dx-required-rule message="Email is required." />
          <dx-email-rule message="Email is invalid." />
        </dx-validator>
      </dx-text-box>
      <br />
      <dx-text-box value="password">
        <dx-validator>
          <dx-required-rule message="Password is required." />
        </dx-validator>
      </dx-text-box>
      <br />
      <dx-validation-summary />
      <dx-button text="Submit" @click="validate" />
    </dx-validation-group>
    <br />
    <h3>Custom value validation</h3>
    <br />
    <div>
      <button @click="validateCustom">Validate custom value</button>
      <input v-model="customValue" />
      <br />
      <div>Not empty: {{ customValueIsNotEmpty }}</div>
      <div>Not less than 0, not greater than 9: {{ customValueIsDigit }}</div>
      <div>Is valid: {{ customValueIsValid }}</div>
      <dx-validator ref="customValidator">
        <dx-adapter :get-value="getCustomValue" />
        <dx-required-rule message="Value is required." />
      </dx-validator>
      <dx-validator ref="customDigitValidator" :validation-rules="validationRules">
        <dx-adapter :get-value="getCustomValue" />
      </dx-validator>
    </div>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import {
  DxButton,
  DxTextBox,
  DxValidationGroup,
  DxValidationSummary,
  DxValidator
} from "devextreme-vue";
import { DxAdapter, DxEmailRule, DxRequiredRule } from "devextreme-vue/validator";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxTextBox,
    DxValidator,
    DxAdapter,
    DxEmailRule,
    DxRequiredRule,
    DxValidationGroup,
    DxValidationSummary,
  },
  data() {
    return {
      customValue: 1,
      customValueIsDigit: true,
      customValueIsNotEmpty: true,
      validationRules: [
          { type: "range", min: 0, max: 9, message: "From 1 to 10" },
        ]
    };
  },
  computed: {
    customValueIsValid() {
      return this.customValueIsNotEmpty && this.customValueIsDigit;
    },
  },
  methods: {
    validate(params) {
      const result = params.validationGroup.validate();
      if (result.isValid) {
        params.validationGroup.reset();
      }
    },
    getCustomValue() {
      return this.customValue;
    },
    validateCustom() {
      var result1 = this.$refs.customValidator.instance.validate();
      var result2 = this.$refs.customDigitValidator.instance.validate();
      this.customValueIsNotEmpty = result1.isValid;
      this.customValueIsDigit = result2.isValid;
    }
  }
};
</script>

<style scoped>
.text-box-label {
  font-weight: 900;
  margin-top: 20px;
}
</style>
