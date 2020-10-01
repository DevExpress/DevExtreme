<template>
  <div>
    <div class="long-title">
      <h3>Colors Representation via Basic Colors</h3>
    </div>
    <div id="gauge-demo">
      <DxBarGauge
        id="gauge"
        :start-value="0"
        :end-value="255"
        :palette="palette"
        :values="values"
      >
        <DxLabel
          :visible="false"
        />
      </DxBarGauge>
      <div class="action-container">
        <DxSelectBox
          id="select-color"
          :width="150"
          :data-source="colors"
          v-model:value="value"
          display-expr="name"
        />
        <div
          :style="{ 'background-color': value.code }"
          class="color-box"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { colors } from './data.js';
import { DxBarGauge, DxPalette, DxLabel } from 'devextreme-vue/bar-gauge';
import { DxSelectBox } from 'devextreme-vue/select-box';

export default {
  components: {
    DxBarGauge, DxPalette, DxLabel,
    DxSelectBox
  },
  data() {
    return {
      colors: colors,
      palette: ['#ff0000', '#00ff00', '#0000ff'],
      value: colors[0]
    };
  },
  computed: {
    values() {
      return this.getBasicColors(this.value.code);
    }
  },
  methods: {
    getBasicColors(value) {
      var code = Number(`0x${ value.slice(1)}`);
      return [
        (code >> 16) & 0xff,
        (code >> 8) & 0xff,
        code & 0xff
      ];
    }
  }
};
</script>
<style scoped>
#gauge-demo {
    height: 440px;
    width: 100%;
}

#gauge {
    width: 80%;
    height: 100%;
    margin-top: 20px;
    float: left;
}

.action-container {
    width: 20%;
    text-align: left;
    margin-top: 20px;
    float: left;
}

.color-box {
    width: 40px;
    height: 40px;
    margin-top: 20px;
}

.long-title h3 {
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
