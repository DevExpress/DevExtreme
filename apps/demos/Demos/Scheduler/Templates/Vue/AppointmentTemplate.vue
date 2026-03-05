<template>
  <div class="movie-preview">
    <div class="movie-preview-image">
      <img
        :src="movieData.image"
        :alt="`${movieData.text} poster`"
      >
    </div>
    <div class="movie-details">
      <div class="title">{{ movieData.text }}</div>
      <div>
        Ticket Price: <strong>${{ templateModel.targetedAppointmentData?.price }}</strong>
      </div>
      <div>
        {{ getFormatDate(templateModel.targetedAppointmentData?.displayStartDate) }} -
        {{ getFormatDate(templateModel.targetedAppointmentData?.displayEndDate) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatDate } from 'devextreme-vue/common/core/localization';
import { query as Query } from 'devextreme-vue/common/data';

import DxScheduler, { type DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { moviesData } from './data.ts';

const props = defineProps<{
  scheduler: DxScheduler['instance'];
  templateModel: DxSchedulerTypes.AppointmentTemplateData;
}>();

function getFormatDate(value: Date) {
  return formatDate(value, 'shortTime');
}
const getMovieById = function (resourceId: string) {
  return Query(moviesData)
    .filter(['id', resourceId])
    .toArray()[0];
};

const movieData = getMovieById(props.templateModel.targetedAppointmentData?.movieId);

</script>
