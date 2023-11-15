<template>
  <div class="medal-tooltip">
    <div class="country-name">{{ data.country }}
      <br v-if="data.oldCountryName">{{ data.oldCountryName }}
    </div>
    <div class="gold">
      <span class="caption">Gold</span>: {{ data.gold }}
    </div>
    <div class="silver">
      <span class="caption">Silver</span>: {{ data.silver }}
    </div>
    <div class="bronze">
      <span class="caption">Bronze</span>: {{ data.bronze }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  annotation?: Record<string, any>
}>(), {
  annotation: () => ({}),
});

const data = ref(props.annotation.data);
</script>
<style>
.medal-tooltip {
  font-size: 12px;
}

.medal-tooltip .country-name {
  font-size: 14px;
  font-weight: 700;
  margin: 5px 0 10px 0;
}

.medal-tooltip .caption {
  font-weight: 600;
}
</style>
