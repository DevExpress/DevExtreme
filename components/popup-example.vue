<template>
  <example-block title="dxPopup" :state="$data">
    <dx-text-box
      :value="text"
      @valueChanged="handleTextUpdate"
      valueChangeEvent="input"
    />
    <br />
    <dx-button text="Show popup" @click="handleClick" />
    <dx-popup v-model:visible="visible" width="600" height="400">
      This is popup content
      <dx-text-box v-model:value="text" valueChangeEvent="input" />
      <dx-button text="Close popup" @click="handleClick" />
    </dx-popup>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { DxButton, DxPopup, DxTextBox } from "devextreme-vue";

export default {
  components: {
    ExampleBlock,
    DxButton,
    DxPopup,
    DxTextBox
  },
  data: function () {
    return {
      text: "not-good",
      handleTextUpdate: (e) => {
        this.updateText(e.value);
      },
      handleClick: () => {
        this.toggle(!this.visible);
      },
      visible: false
    };
  },
  methods: {
    updateText: function (value) {
      this.text = value;
    },
    toggle: function (value) {
      this.visible = value;
    }
  },
  name: "popup-example"
};
</script>
