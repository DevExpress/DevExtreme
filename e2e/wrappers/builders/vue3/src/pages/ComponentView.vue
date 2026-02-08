<script setup>
import { ref, defineProps, onMounted, shallowRef } from 'vue';

const props = defineProps({
  componentInfo: Object
});

const Component = shallowRef(null);

onMounted(async () => {

  try {
    const module = await props.componentInfo.component();
    Component.value = module.default;
  } catch (err) {}
});
</script>

<template>
  <div class="component-view">
    <div class="component-container">
      <component :is="Component" />
    </div>
  </div>
</template>

<style scoped></style> 