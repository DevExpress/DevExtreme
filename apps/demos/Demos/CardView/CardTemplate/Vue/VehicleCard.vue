<template>
  <div class="vehicle__card">
    <div class="vehicle__img-wrapper">
      <img class="vehicle__img"
        :src="`../../../../images/vehicles/image_${id}.png`"
        :alt="`${model}`"
      >
    </div>
    <div class="vehicle__info">
      <div class="vehicle__name" :title="`${model}`">
        {{ model }}
      </div>
      <div class="vehicle__price">
        {{ price }}
      </div>
      <div class="vehicle__type-container">
        <div class="vehicle__type">
          {{ categoryName }}
        </div>
      </div>
      <div class="vehicle__spec-container">
        <div class="vehicle__modification">
          {{ modification }}
        </div>
        <div class="vehicle__modification">
          {{ bodyStyleName }}
        </div>
        <div class="vehicle__modification">
           {{ horsepower }} h.p.
        </div>
      </div>
      <div class="vehicle__footer-container">
        <DxButton
          text="Image Info"
          type="default"
          width="100%"
          @click="$emit('show-info', vehicle)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DxButton } from 'devextreme-vue/button';
import type { Vehicle } from './data.ts';

defineProps<{
  vehicle: Vehicle,
  id: number,
  model: string,
  price: string,
  categoryName: string,
  modification: string,
  bodyStyleName: string,
  horsepower: string,
}>();

defineEmits(['show-info']);
</script>

<style>
  .vehicle__img-wrapper {
      overflow: hidden;
      display: flex;
      justify-content: center;
      aspect-ratio: 16 / 9;
      width: 100%;
      background-color: #fff;
  }

  .vehicle__img {
      height: 100%;
      width: 100%;
      object-fit: scale-down;
  }

  .vehicle__info {
      padding: 12px;
      border-top: var(--dx-border-width) solid var(--dx-color-border);
  }

  .vehicle__name {
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      height: 28px;
      padding: 0 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
  }

  .vehicle__price {
      padding: 0 12px;
      height: 32px;
      font-weight: 700;
      font-size: 24px;
      color: var(--dx-color-primary);
  }

  .vehicle__type-container {
      padding: 12px;
      display: inline-block;
  }

  .vehicle__type {
      padding: 2px 6px;
      background-color: var(--dx-color-separator);
      border-radius: 13px;
  }

  .vehicle__spec {
      padding: 2px 12px;
  }

  .vehicle__modification {
      height: 24px;
      padding: 2px 0 2px 12px;
  }

  .vehicle__footer-container {
      padding: 12px;
  }

  .vehicle__image-licence-caption {
      font-weight: 600;
  }
</style>
