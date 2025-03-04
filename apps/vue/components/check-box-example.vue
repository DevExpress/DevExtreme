<template>
  <example-block title="v-model">
    with value:
    <br>
    <dx-check-box v-model="checkBoxValue" />
    <br>
    <div>checkBoxValue: {{ checkBoxValue ? '🟢' : '🔴' }}</div>
    <br>
    -------------
    <br>
    with modelValue:
    <br>
    <input type="checkbox" v-model="checkBoxValue2" />
    <br>
    <div>checkBoxValue: {{ checkBoxValue2 ? '🟢' : '🔴' }}</div>
    <br>
    -------------
    <br>
    <br>
    native:
    <br>
    <input v-model="inputValueNative" style="border: 1px solid gray;"/>
    <div>text: {{ inputValueNative }}</div>
    <br>
    ---------------
    <br>
    <br>
    DX:
    <br>
    <dx-text-box v-model="inputValue" />
    <div>text: {{ inputValue }}</div>
  </example-block>
</template>

<script>
import { ref, watch } from 'vue';
import ExampleBlock from "./example-block";
import { DxCheckBox } from "devextreme-vue/check-box";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxList, DxItem } from "devextreme-vue/list";

const checkBoxValue2 = ref(false);

watch(checkBoxValue2, (newValue) => console.log("checkBoxValue2 changed:", newValue));

export default {
  components: {
    ExampleBlock,
    DxCheckBox,
    DxTextBox,
    DxList,
    DxItem,
  },
  data() {
    return {
      checkBoxValue: false,
      checkBoxValue2,
      inputValue: 'inputValue',
      inputValueNative: 'inputValueNative',
      selectedItems: [],
    };
  },
  methods: {
    updateValue(event) {
      console.log("updateValue:", event);
      this.checkBoxValue = event.value;
    }
  }
};
</script>
