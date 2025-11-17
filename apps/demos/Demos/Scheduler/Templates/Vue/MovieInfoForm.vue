<template>
  <div class="movie-info-container">
    <div
      v-if="movie"
      class="movie-info"
    >
      <div class="movie-preview-image">
        <img
          :src="movie.image"
          :alt="movie.text"
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

<style scoped>
.movie-info-container {
  border-radius: 8px;
  padding-bottom: 8px;
}

.movie-info {
  display: flex;
  gap: 12px;
}

.movie-preview-image {
  max-height: 80px;
  max-width: 80px;
  min-height: 60px;
  min-width: 60px;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid var(--dx-color-border);
}

.movie-preview-image img {
  width: 100%;
  position: relative;
  top: -25%;
  pointer-events: none;
}

.movie-details {
  text-align: left;
}

.movie-details > .title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
