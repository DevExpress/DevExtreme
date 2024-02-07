<template>
  <DxVectorMap
    id="vector-map"
    :max-zoom-factor="2"
    :projection="projection"
  >
    <DxTitle
      text="Map of Pangaea"
      subtitle="with modern continental outlines"
    />
    <DxLayer
      :data-source="pangaeaBorders"
      :hover-enabled="false"
      name="pangaea"
      color="#bb7862"
    />
    <DxLayer
      :data-source="pangaeaContinents"
      :customize="customizeLayer"
    >
      <DxLabel
        :enabled="true"
        data-field="name"
      />
    </DxLayer>
    <DxExport :enabled="true"/>
  </DxVectorMap>
</template>
<script setup lang="ts">
import {
  DxVectorMap,
  DxLabel,
  DxLayer,
  DxExport,
  DxTitle,
} from 'devextreme-vue/vector-map';
import { pangaeaBorders, pangaeaContinents } from './data.ts';

const projection = {
  to: ([l, lt]) => [l / 100, lt / 100],
  from: ([x, y]) => [x * 100, y * 100],
};

function customizeLayer(elements) {
  elements.forEach((element) => {
    element.applySettings({
      color: element.attribute('color'),
    });
  });
}
</script>
<style>
#vector-map {
  height: 570px;
}
</style>
