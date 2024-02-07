<template>
  <div>
    <DxTileView
      :items="homes"
      :height="height"
      :base-item-height="baseItemHeight"
      :base-item-width="baseItemWidth"
      :width="width"
      :item-margin="itemMargin"
      :direction="direction"
    >
      <template #item="{ data }">
        <HomeItem :item-data="data"/>
      </template>
    </DxTileView>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Direction </span>
        <DxSelectBox
          v-model:value="direction"
          :input-attr="{ 'aria-label': 'Direction' }"
          :items="directions"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTileView from 'devextreme-vue/tile-view';
import DxSelectBox from 'devextreme-vue/select-box';
import HomeItem from './HomeItem.vue';
import { homes } from './data.ts';

const directions = ['horizontal', 'vertical'];
const direction = ref('horizontal');
const height = 390;
const baseItemHeight = 120;
const baseItemWidth = 185;
const width = '100%';
const itemMargin = 10;
</script>
<style>
.dx-selectbox {
  max-width: 400px;
}

.dx-tile-content {
  height: 100%;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  width: 74px;
  display: inline-block;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  max-width: 350px;
}
</style>
