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
    }
  }
}
</script>

<template>
  <main>
    <DxRadioButton label="Check Me" :checked="checked" labelTemplate="labelTemplate" radioTemplate="radioTemplate">
      <template #labelTemplate="{ data: { label } }">
        {{ label.toUpperCase() }}
      </template>
      <template #radioTemplate="{ data: { checked } }">
        {{ checked ? '✔' : '∅' }}
      </template>
    </DxRadioButton>
      <button @click="switchChecked()">Switch Value</button>
  </main>
</template>
