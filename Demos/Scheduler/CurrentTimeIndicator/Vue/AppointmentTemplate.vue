<template>
  <div class="movie">
    <img :src="movieInfo.image">
    <div class="movie-text">{{ movieInfo.text }}</div>
  </div>
</template>

<script setup lang="ts">
import Query from 'devextreme/data/query';
import { moviesData } from './data.js';

const props = withDefaults(defineProps<{
  appointmentModel?: {
    appointmentData?: any
  }
}>(), {
  appointmentModel: () => ({}),
});
const getMovieInfo = function(data) {
  return Query(moviesData)
    .filter(['id', data.movieId])
    .toArray()[0] || {};
};
const movieInfo = getMovieInfo(props.appointmentModel.appointmentData);

</script>
