<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="7"
    >
      <DxScale
        :start-value="0"
        :end-value="10"
        :tick-interval="2"
      />
      <DxTitle
        text="Amount of Produced Gold (Kilos)"
        horizontal-alignment="center"
        vertical-alignment="bottom"
      >
        <DxFont
          :size="30"
          color="#CFB53B"
        />
        <DxMargin
          :top="25"
        />
      </DxTitle>
    </DxCircularGauge>
  </div>
</template>
<script>
import { DxCircularGauge, DxScale, DxTitle, DxFont, DxMargin } from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge, DxScale, DxTitle, DxFont, DxMargin
  }
};
</script>
<style scoped>
#gauge {
    height: 440px;
    width: 100%;
}
</style>
