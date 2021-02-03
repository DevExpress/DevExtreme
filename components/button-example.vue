<template>
  <example-block title="dxButton">
    <dx-button
    text="click me"
    v-on:click="greet" />
    <dx-button
    text="I'm colored"
    :elementAttr="buttonAttrs"
    />
    <dx-button
    text="I'm dangerous"
    type="danger"
    />
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { DxButton } from "devextreme-vue";

export default {
  components: {
    ExampleBlock,
    DxButton
  },
  data: function() {
    return {
      buttonAttrs: { style: 'background-color: #ffc' }
      }
  },
  methods: {
    greet: function () {
      alert("Hello!");
    }
  }
};
</script>

<style scoped>
.test {
  padding: 10px;
  border: 1px solid black;
  display: inline-block;
}
</style>
