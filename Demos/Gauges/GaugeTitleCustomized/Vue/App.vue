<template>
  <div>
    <DxCircularGauge
      id="gauge"
      :value="7.78"
      center-template="centerTemplate"
    >
      <DxScale
        :start-value="0"
        :end-value="10"
        :tick-interval="1"
      >
        <DxMinorTick :visible="true"/>
      </DxScale>
      <DxExport :enabled="true"/>
      <DxRangeContainer background-color="#03a9f4"/>
      <DxValueIndicator color="#03a9f4"/>
      <DxTitle
        text="Amount of Produced Gold (Kilos)"
        vertical-alignment="bottom"
      >
        <DxFont
          :size="25"
        />
        <DxMargin
          :top="25"
        />
      </DxTitle>
      <template #centerTemplate="data">
        <svg>
          <rect
            x="0"
            y="0"
            width="200"
            height="200"
            fill="transparent"
          />
          <g transform="translate(50 0)">
            <rect
              x="0"
              y="0"
              width="100"
              height="50"
              rx="25"
              fill="#f2f2f2"
            />
            <text
              text-anchor="middle"
              font-size="20"
              y="25"
              x="50"
              fill="#000"
              alignment-baseline="middle"
            >
              {{ data.data.value() }}
            </text>
          </g>
          <g transform="translate(43 140)">
            <rect
              class="description"
              x="0"
              y="0"
              width="114"
              height="56"
              rx="8"
              fill="#fff"
            />
            <text
              text-anchor="middle"
              font-size="12"
              y="23"
              x="57"
              fill="#000"
              alignment-baseline="middle"
            >
              <tspan x="57">Capacity: 10kg</tspan>
              <tspan
                x="57"
                dy="20"
              >Graduation: 10g</tspan>
            </text>
          </g>
        </svg>
      </template>
    </DxCircularGauge>
  </div>
</template>
<script>
import {
  DxCircularGauge, DxScale, DxTitle, DxFont, DxMargin, DxMinorTick, DxExport,
  DxRangeContainer, DxValueIndicator,
} from 'devextreme-vue/circular-gauge';

export default {
  components: {
    DxCircularGauge,
    DxScale,
    DxTitle,
    DxFont,
    DxMargin,
    DxMinorTick,
    DxExport,
    DxRangeContainer,
    DxValueIndicator,
  },
};
</script>
<style scoped>
#gauge {
  height: 440px;
  width: 100%;
}

.description {
  filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.16));
}
</style>
