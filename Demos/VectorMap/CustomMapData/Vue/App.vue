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
<script>

import {
  DxVectorMap,
  DxLabel,
  DxLayer,
  DxExport,
  DxTitle
} from 'devextreme-vue/vector-map';

import { pangaeaBorders, pangaeaContinents } from './data.js';

export default {
  components: {
    DxVectorMap,
    DxLabel,
    DxLayer,
    DxExport,
    DxTitle
  },
  data() {
    return {
      pangaeaBorders,
      pangaeaContinents,
      projection: {
        to: ([l, lt]) => [l / 100, lt / 100],
        from: ([x, y]) => [x * 100, y * 100]
      }
    };
  },
  methods: {
    customizeLayer(elements) {
      elements.forEach((element) => {
        element.applySettings({
          color: element.attribute('color')
        });
      });
    }

  }
};
</script>
<style>
#vector-map {
   height: 570px;
}
</style>
