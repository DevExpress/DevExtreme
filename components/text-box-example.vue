<template>
  <example-block title="dxTextBox" :state="$data">
    <h5 class="text-box-label">v-bind</h5>
    <dx-text-box
    :value="text"
    valueChangeEvent="input"
    />
    <h5 class="text-box-label">@update:value</h5>
    <dx-text-box
    @update:value="text = $event"
    valueChangeEvent="input"
    />
    <h5 class="text-box-label">@valueChanged</h5>
    <dx-text-box
    @valueChanged="text = $event.value"
    valueChangeEvent="input"
    />
    <h5 class="text-box-label">@value-changed</h5>
    <dx-text-box
      @value-changed="text = $event.value"
      valueChangeEvent="input"
    />
    <h5 class="text-box-label">v-model</h5>
    <dx-text-box
    v-model="text"
    valueChangeEvent="input"
    />
    <h5 class="text-box-label">@focusIn (clears text)</h5>
    <dx-text-box
    v-model:value="text"
    @focusIn="text = ''"
    valueChangeEvent="input" />
    <h5 class="text-box-label">Validation (Required)</h5>
    <dx-text-box value="Required text">
      <dx-validator :validationRules="rules" />
    </dx-text-box>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";

import { DxTextBox, DxValidator } from "devextreme-vue";

export default {
  components: {
    ExampleBlock,
    DxTextBox,
    DxValidator
  },
  data: function () {
    return {
      text: "text",
      rules: [
        {
          type: "required",
          message: "this is required"
        }
      ]
    };
  }
};
</script>

<style scoped>
.text-box-label {
  font-weight: 900;
  margin-top: 20px;
}
</style>
