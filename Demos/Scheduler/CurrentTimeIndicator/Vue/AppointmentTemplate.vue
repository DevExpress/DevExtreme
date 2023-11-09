<template>
  <div class="movie">
    <img :src="movieInfo.image">
    <div class="movie-text">{{ movieInfo.text }}</div>
  </div>
</template>

<script setup lang="ts">
import Query from 'devextreme/data/query';
import { DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { moviesData } from './data.ts';

const props = defineProps<{
  appointmentModel: DxSchedulerTypes.AppointmentTemplateData
}>();

const getMovieInfo = function(data: DxSchedulerTypes.Appointment) {
  return Query(moviesData)
    .filter(['id', data.movieId])
    .toArray()[0] || {};
};
const movieInfo = getMovieInfo(props.appointmentModel.appointmentData);

</script>
