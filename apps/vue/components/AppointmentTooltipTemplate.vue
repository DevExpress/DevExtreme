<template>
  <div class="movie-tooltip">
    AppointmentTooltipTemplateSlot test
    <img :src="movieData.image">
    <div class="movie-info">
      <div class="movie-title">
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

<script>
import Query from 'devextreme/data/query';
import { moviesData } from './scheduler-custom-data.js';

export default {
  props: {
    scheduler: Object,
    templateTooltipModel: Object
  },
  computed: {
    movieData() {
      return this.getMovieById(this.templateTooltipModel.appointmentData.movieId);
    }
  },
  methods: {
    getMovieById(resourceId) {
      return Query(moviesData)
        .filter(['id', resourceId])
        .toArray()[0];
    }
  }
};
</script>

<style scoped>
.movie-tooltip .movie-info {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
  text-align: left;
}

.movie-tooltip img {
  height: 80px;
  margin-bottom: 10px;
}

.movie-tooltip .movie-title {
  font-size: 1.5em;
  line-height: 40px;
}
</style> 