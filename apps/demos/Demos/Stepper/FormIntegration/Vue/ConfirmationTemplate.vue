<template>
  <div
    class="summary-item-header center"
    v-if="isConfirmed"
  >
    Your booking request was submitted.
  </div>

  <div
    class="summary-container"
    v-if="!isConfirmed"
  >
    <div class="summary-item">
      <div class="summary-item-header">Dates</div>
      <div class="separator"/>
      <div>
        <span class="summary-item-label">Check-in Date: </span>
        {{ formatDate(formData.dates[0]) }}
      </div>
      <div>
        <span class="summary-item-label">Check-out Date: </span>
        {{ formatDate(formData.dates[1]) }}
      </div>
    </div>

    <div class="summary-item">
      <div class="summary-item-header">Guests</div>
      <div class="separator"/>
      <div><span class="summary-item-label">Adults: </span>{{ formData.adultsCount }}</div>
      <div><span class="summary-item-label">Children: </span>{{ formData.childrenCount }}</div>
      <div><span class="summary-item-label">Pets: </span>{{ formData.petsCount }}</div>
    </div>

    <div class="summary-item">
      <div class="summary-item-header">Room and Meals</div>
      <div class="separator"/>
      <div><span class="summary-item-label">Room Type: </span>{{ formData.roomType }}</div>
      <div><span class="summary-item-label">Check-out Date: </span>{{ formData.mealPlan }}</div>
    </div>

    <div
      class="summary-item"
      v-if="!!formData.additionalRequest"
    >
      <div class="summary-item-header">Additional Requests</div>
      <div class="separator"/>
      <div>{{ formData.additionalRequest }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookingFormData } from './types.ts';
import { initialFormData } from './data.ts';

const props = withDefaults(defineProps<{
  formData?: BookingFormData;
  isConfirmed?: boolean;
}>(), {
  formData: () => initialFormData,
  isConfirmed: () => false,
});

const formatDate = (value: Date | null) => value ? new Date(value).toLocaleDateString() : '';
</script>
