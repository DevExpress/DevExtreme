<template>
  <DxTagBox
    :value="conditionInfo.value"
    :items="categories"
    :input-attr="{ 'aria-label': 'Category' }"
    width="auto"
    @value-changed="onValueChanged"
  />
</template>

<script setup lang="ts">
import DxTagBox, { type DxTagBoxTypes } from 'devextreme-vue/tag-box';
import { categories } from './data.ts';

const props = withDefaults(defineProps<{
  conditionInfo?: Record<string, any>
}>(), {
  conditionInfo: () => ({} as Record<string, any>),
});

function onValueChanged(e: DxTagBoxTypes.ValueChangedEvent) {
  props.conditionInfo.setValue(e.value && e.value.length ? e.value : null);
}
</script>
