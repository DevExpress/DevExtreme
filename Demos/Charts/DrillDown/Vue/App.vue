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

<script setup lang="ts">
import { ref } from 'vue';
import DxTreeMap, {
  DxSize, DxTitle, DxColorizer, DxTreeMapTypes,
} from 'devextreme-vue/tree-map';
import { citiesPopulation } from './data.js';

const drillInfo = ref([]);

function nodeClick({ node }: DxTreeMapTypes.ClickEvent) {
  node.drillDown();
}
function drill(e: DxTreeMapTypes.DrillEvent) {
  drillInfo.value = [];
  for (let node = e.node.getParent(); node; node = node.getParent()) {
    drillInfo.value.unshift({
      text: node.label() || 'All Continents',
      node,
    });
  }
  if (drillInfo.value.length) {
    drillInfo.value.push({
      text: e.node.label(),
    });
  }
}
function drillInfoClick(node) {
  node?.drillDown();
}
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
