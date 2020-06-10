<template>
  <div>
    <DxTreeMap
      :data-source="citiesPopulation"
      :interact-with-group="true"
      :max-depth="2"
      @click="nodeClick"
      @drill="drill"
    >
      <DxSize :height="440"/>
      <DxColorizer palette="Soft"/>
      <DxTitle
        :placeholder-size="80"
        text="The Most Populated Cities by Continents"
      />
    </DxTreeMap>
    <div id="drill-down-title">
      <span
        v-for="(info, index) in drillInfo"
        :key="index"
      >
        <span
          :class="{'link': !!info.node}"
          @click="drillInfoClick(info.node)"
        >{{ info.text }}</span>
        <span v-if="index !== drillInfo.length - 1"> > </span>
      </span>
    </div>
  </div>
</template>

<script>

import DxTreeMap, { DxSize, DxTitle, DxColorizer } from 'devextreme-vue/tree-map';
import { citiesPopulation } from './data.js';

export default {
  components: {
    DxTreeMap,
    DxSize,
    DxTitle,
    DxColorizer
  },
  data() {
    return {
      drillInfo: [],
      citiesPopulation
    };
  },
  methods: {
    nodeClick(e) {
      e.node.drillDown();
    },

    drill(e) {
      this.drillInfo = [];
      for(let node = e.node.getParent(); node; node = node.getParent()) {
        this.drillInfo.unshift({
          text: node.label() || 'All Continents',
          node: node
        });
      }
      if(this.drillInfo.length) {
        this.drillInfo.push({
          text: e.node.label()
        });
      }
    },

    drillInfoClick(node) {
      if(node) {
        node.drillDown();
      }
    }
  }
};
</script>

<style>
#drill-down-title {
    position: absolute;
    top: 50px;
    height: 36px;
    width: 100%;
    text-align: center;
}

.link {
    color: #337ab7;
    text-decoration: underline;
    cursor: pointer;
}
</style>
