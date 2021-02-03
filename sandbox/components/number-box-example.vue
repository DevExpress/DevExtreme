<template>
    <example-block title="dxNumberBox">
        <dx-number-box
            :min="0"
            :max="200"
            v-model="value"
            format="$ #0.##"
        />
        This is {{ value }}
    </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import { DxNumberBox } from "../../src";

export default {
  components: {
    ExampleBlock,
    DxNumberBox
  },
  data: function() {
    return {
      value: 100.123
    };
  }
};
</script>
