<template>
  <div class="movie-info">
    <div class="movie-preview-image">
      <img
        :src="movieData.image"
        :alt="`${movieData.text} poster`"
      >
    </div>
    <div class="movie-details">
      <div class="title">
        {{ movieData.text }} ({{ movieData.year }})
      </div>
      <div>
        Director: {{ movieData.director }}
      </div>
      <div>
        Duration: {{ movieData.duration }} minutes
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { query as Query } from 'devextreme-vue/common/data';
import DxScheduler, { type DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { moviesData } from './data.ts';

const props = defineProps<{
  scheduler?: DxScheduler['instance']
  templateTooltipModel?: DxSchedulerTypes.AppointmentTooltipTemplateData
}>();

const getMovieById = function (resourceId: string) {
  return Query(moviesData)
    .filter(['id', resourceId])
    .toArray()[0];
};
const movieData = getMovieById(props.templateTooltipModel?.appointmentData.movieId);
</script>
