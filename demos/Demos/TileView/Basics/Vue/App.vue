<template>
  <DxTileView
    :items="homes"
  >
    <template #item="{ data }">
      <div
        :style="{backgroundImage: 'url(' + data.ImageSrc + ')'}"
        class="dx-tile-image"
      />
    </template>
  </DxTileView>
</template>
<script setup lang="ts">
import DxTileView from 'devextreme-vue/tile-view';
import { homes } from './data.ts';
</script>
<style>
.dx-tile-image {
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  display: block;
}
</style>
