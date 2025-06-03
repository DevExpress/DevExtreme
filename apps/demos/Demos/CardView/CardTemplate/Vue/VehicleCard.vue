<template>
  <div class="vehicle__card">
    <div class="vehicle__img-wrapper">
      <img class="vehicle__img"
        :src="`../../../../images/vehicles/image_${vehicle.ID}.png`"
        :alt="`${vehicle.TrademarkName} ${vehicle.Name}`"
      >
    </div>
    <div class="vehicle__info">
      <div class="vehicle__name" :title="`${vehicle.TrademarkName} ${vehicle.Name}`">
        {{ vehicle.TrademarkName }} {{ vehicle.Name }}
      </div>
      <div class="vehicle__price">
        ${{ vehicle.Price }}
      </div>
      <div class="vehicle__type-container">
        <div class="vehicle__type">
          {{ vehicle.CategoryName }}
        </div>
      </div>
      <div class="vehicle__spec-container">
        <div class="vehicle__modification">
          {{ vehicle.Modification }}
        </div>
        <div class="vehicle__modification">
          {{ vehicle.BodyStyleName }}
        </div>
        <div class="vehicle__modification">
           {{ vehicle.Horsepower }} h.p.
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
import { Vehicle } from './data';

defineProps<{
  vehicle: Vehicle
}>();

defineEmits(['show-info']);
</script>
