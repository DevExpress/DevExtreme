<template>
  <div class="movie-info-container">
    <div
      v-if="movie"
      class="movie-info"
    >
      <div class="movie-preview-image">
        <img
          :src="movie.image"
          :alt="`${movie.text} poster`"
        >
      </div>
      <div class="movie-details">
        <div class="title">{{ movie.text }} ({{ movie.year }})</div>
        <div>Director: {{ movie.director }}</div>
        <div>Duration: {{ movie.duration }} minutes</div>
      </div>
    </div>
    <div
      v-else
      class="movie-info"
    >
      <div class="movie-preview-image"/>
      <div class="movie-details">
        <div class="title">Select a movie</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieResource } from './data';

defineProps<{
  movie: MovieResource | null | undefined;
}>();
</script>
