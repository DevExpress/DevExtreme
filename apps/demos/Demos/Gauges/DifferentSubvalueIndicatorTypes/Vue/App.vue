<template>
  <div>
    <div class="long-title">
      <h3>Grades of Goods</h3>
    </div>
    <div id="gauge-demo">
      <DxCircularGauge
        id="triangleMarker"
        :value="8"
        :subvalues="[2,8]"
      >
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="1"
        />
        <DxSubvalueIndicator
          type="triangleMarker"
          color="#8FBC8F"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="rectangleNeedle"
        :value="9"
        :subvalues="[2,8]"
      >
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="1"
        />
        <DxSubvalueIndicator
          type="rectangleNeedle"
          color="#9B870C"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="triangleNeedle"
        :value="5"
        :subvalues="[2,8]"
      >

        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="1"
        />
        <DxSubvalueIndicator
          type="triangleNeedle"
          color="#779ECB"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="textCloud"
        :value="6"
        :subvalues="[2,8]"
      >
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="1"
        />
        <DxSubvalueIndicator
          type="textCloud"
          color="#f05b41"
        />
      </DxCircularGauge>
      <DxCircularGauge
        id="twoColorNeedle"
        :value="4"
        :subvalues="[2,8]"
      >
        <DxGeometry
          :start-angle="180"
          :end-angle="0"
        />
        <DxScale
          :start-value="0"
          :end-value="10"
          :tick-interval="1"
        />
        <DxSubvalueIndicator
          type="twoColorNeedle"
          color="#779ECB"
          second-color="#734F96"
        />
      </DxCircularGauge>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  DxCircularGauge, DxScale, DxGeometry, DxSubvalueIndicator,
} from 'devextreme-vue/circular-gauge';
</script>
<style scoped>
#gauge-demo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#triangleMarker,
#rectangleNeedle,
#triangleNeedle,
#textCloud,
#twoColorNeedle {
  display: inline-block;
  width: 33%;
}

#textCloud {
  width: 42%;
}

.long-title h3 {
  font-family:
    'Segoe UI Light',
    'Helvetica Neue Light',
    'Segoe UI',
    'Helvetica Neue',
    'Trebuchet MS',
    Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
