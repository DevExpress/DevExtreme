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
          :items="directions"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxTileView from 'devextreme-vue/tile-view';
import DxSelectBox from 'devextreme-vue/select-box';

import HomeItem from './HomeItem.vue';
import { homes } from './data.js';

export default {
  components: {
    DxTileView,
    DxSelectBox,
    HomeItem
  },
  data() {
    return {
      homes,
      directions: ['horizontal', 'vertical'],
      direction: 'horizontal',
      height: 390,
      baseItemHeight: 120,
      baseItemWidth: 185,
      width: '100%',
      itemMargin: 10
    };
  }
};
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
