<template>
    <example-block title="Accessing Widget Instance">
        <dx-text-box :ref="textBoxRefName"/>
        <br/>
        <dx-button text="Set focus" @click="setFocus"/>
        <br/><br/>
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { DxButton, DxTextBox } from "devextreme-vue";

const textBoxRefName = "some-ref-name";

export default {
  data: function() {
    return {
      textBoxRefName
    };
  },

  components: {
    DxTextBox,
    DxButton,
    ExampleBlock
  },

  methods: {
    setFocus: function() {
      this.textBox.focus();
    }
  },

  computed: {
    textBox: function() {
      return this.$refs[textBoxRefName].instance;
    }
  }
};
</script>
