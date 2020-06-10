<template>
  <div class="movie">
    <img :src="movieInfo.image">
    <div class="movie-text">{{ movieInfo.text }}</div>
  </div>
</template>

<script>
import Query from 'devextreme/data/query';

import { moviesData } from './data.js';

const getMovieInfo = function(data) {
  return Query(moviesData)
    .filter('id', data.movieId)
    .toArray()[0] || {};
};

export default {
  props: {
    appointmentModel: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      moviesData: moviesData,
      movieInfo: getMovieInfo(this.appointmentModel.appointmentData)
    };
  }
};
</script>
