<template>
  <example-block title="v-model">
    DX with value:
    <br>
    <dx-check-box v-model="dxCheckBoxValue" />
    <br>
    <div>checkBoxValue: {{ dxCheckBoxValue ? '🟢' : '🔴' }}</div>
    <br>
    -------------
    <br>
    Native checkbox with modelValue:
    <br>
    <input type="checkbox" v-model="checkBoxValue2" />
    <br>
    <div>checkBoxValue: {{ checkBoxValue2 ? '🟢' : '🔴' }}</div>
    <br>
  </example-block>
</template>

<script>
import { ref, watch } from "vue";
import ExampleBlock from "./example-block";
import { DxCheckBox } from "devextreme-vue/check-box";

const checkBoxValue2 = ref(false);

watch(checkBoxValue2, (newValue) => console.log("checkBoxValue2 changed:", newValue));

export default {
  components: {
    ExampleBlock,
    DxCheckBox,
  },
  data() {
    return {
      dxCheckBoxValue: false,
      checkBoxValue2,
    };
  },
};
</script>
