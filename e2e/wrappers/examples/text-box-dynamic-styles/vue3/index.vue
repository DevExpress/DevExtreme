<template>
  <DxTextBox
    :value="value"
    @value-changed="onValueChanged"
    :style="getStyle()" />
</template>

<script setup>
import { ref } from 'vue';
import DxTextBox from 'devextreme-vue/text-box';

const value = ref('');
const enableInlineStyles = ref(false);

const colors = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)'
];
let colorIndex = 0;

function onValueChanged(e) {
  value.value = e.value;
  enableInlineStyles.value = true;
}

function getStyle() {
  if (enableInlineStyles.value) {
    const changedStyle = {
      backgroundColor: colors[colorIndex],
    };

    colorIndex = (colorIndex + 1) % colors.length;
    return changedStyle;
  }
  return {};
}
</script>
