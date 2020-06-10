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
<script>
import DxTileView from 'devextreme-vue/tile-view';

import { homes } from './data.js';

export default {
  components: {
    DxTileView
  },
  data() {
    return {
      homes
    };
  }
};
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
