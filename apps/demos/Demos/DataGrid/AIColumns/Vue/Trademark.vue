<template>
  <div class="trademark__wrapper">
    <div class="trademark__img-wrapper">
      <img
        class="trademark__img"
        :src="`../../../../images/vehicles/image_${ID}.png`"
        :alt="`${TrademarkName} ${Name}`"
        @click="emit('showInfo', vehicle)"
        @keydown="onKeyDown"
        role="button"
        tabindex="0"
        aria-haspopup="dialog"
        :aria-label="`${TrademarkName} ${Name} - press Enter for image info`"
      >
    </div>
    <div class="trademark__text-wrapper">
      <div class="trademark__text trademark__text--title">{{ TrademarkName }}</div>
      <div class="trademark__text trademark__text--subtitle">{{ Name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from './data.ts';

interface TrademarkNameProps { vehicle: Vehicle }
interface TrademarkNameEmits { (e: 'showInfo', v: Vehicle): void }

const { vehicle } = defineProps<TrademarkNameProps>();
const emit = defineEmits<TrademarkNameEmits>();

const { ID, TrademarkName, Name } = vehicle;

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('showInfo', vehicle);
  }
};
</script>

<style scoped>
.trademark__wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trademark__img-wrapper {
  width: 40px;
  height: 40px;
  border: var(--dx-border-width) solid var(--dx-color-border);
  border-radius: var(--dx-border-radius);
  cursor: pointer;
}

.trademark__img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--dx-border-radius);
}

.trademark__text-wrapper {
  width: calc(100% - 48px);
}

.trademark__text {
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trademark__text--title {
  font-weight: 600;
}

.trademark__text--subtitle {
  font-weight: 400;
}
</style>
