<template>
  <svg>
    <circle
      :r="(pieChart?.getInnerRadius() || 6 ) - 6"
      cx="100"
      cy="100"
      fill="#eee"
    />
    <image
      :href="getImagePath(country)"
      x="70"
      y="58"
      width="60"
      height="40"
    />
    <text
      :style="{fontSize: 18, fill: '#494949'}"
      text-anchor="middle"
      x="100"
      y="120"
    >
      <tspan x="100">{{ country }}</tspan><tspan
        :style="{ fontWeight: 600 }"
        x="100"
        dy="20px"
      >{{ calculateTotal(pieChart) }}</tspan>
    </text>
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { type DxPieChart } from "devextreme-vue/pie-chart";

type DxPieChartInstance = DxPieChart['instance'];

const props = defineProps<{
  pieChart: DxPieChartInstance
}>();

const country = computed(() => {
  return props ? props.pieChart
      ?.getAllSeries()[0]
      ?.getVisiblePoints()[0]
      ?.data
      ?.country as string : '';
});

const getImagePath = (countryName: string): string => `../../../../images/flags/${countryName.replace(/\s/, '').toLowerCase()}.svg`;
const calculateTotal = (pieChart: DxPieChartInstance): string => {
  const points = pieChart?.getAllSeries()[0]?.getVisiblePoints() || [];
  
  return formatNumber(
      points.reduce<number>((s: number, p) => {
        if (typeof p.originalValue == 'number') {
          return s + p.originalValue;
        }
        
        return s;
      }, 0)
  )
};

const formatNumber = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
}).format;
</script>
