<template>
  <div class="tooltip-template">
    <div>{{ pointInfo.argumentText }}</div>
    <div><span>Open: </span>
      {{ formatCurrency(prices.openValue) }}
    </div>
    <div><span>High: </span>
      {{ formatCurrency(prices.highValue) }}
    </div>
    <div><span>Low: </span>
      {{ formatCurrency(prices.lowValue) }}
    </div>
    <div><span>Close: </span>
      {{ formatCurrency(prices.closeValue) }}
    </div>
    <div><span>Volume: </span>
      {{ formatNumber(volume.value) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  pointInfo: Record<string, any>
}>(), {
  pointInfo: () => ({}),
});
const volume = computed<{value : number}>(() => props.pointInfo.points.filter(({ seriesName }) => seriesName === 'Volume')[0]);
const prices = computed<Record<string, any>>(() => props.pointInfo.points.filter(({ seriesName }) => seriesName !== 'Volume')[0]);

const formatCurrency = new Intl.NumberFormat('en-US',
  { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format;

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
}).format;
</script>
<style>
.tooltip-template span {
  font-weight: 500;
}
</style>
