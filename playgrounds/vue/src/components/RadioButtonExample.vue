<script setup lang="ts">
import { DxRadioButton } from '../../../../packages/vue/src/radio-button';
</script>

<script lang="ts">
export default {
  data() {
    return {
      checked: false
    }
  },
  methods: {
    switchChecked() {
      this.checked = !this.checked;
    },
    onClick() { // not fired if checked is true
      console.log('onClick fired');
      this.checked = !this.checked;
    },
    onSelected() {
      console.log('onSelected fired');
    }
  }
}
</script>

<template>
  <main>
    <button @click="switchChecked()">Switch Value</button>
    <DxRadioButton
      label="Check Me"
      :checked="checked"
      :onClick="onClick"
      :onSelected="onSelected"
    >
      <template #labelTemplate="{ data: { label } }">
        {{ label.toUpperCase() }}
      </template>
      <template #radioTemplate="{ data: { checked } }">
        {{ checked ? '✔' : '∅' }}
      </template>
    </DxRadioButton>
  </main>
</template>
