<template>
  <DxPieChart
    id="pie"
    :data-source="dataSource"
    palette="Vintage"
    title="Ice Hockey World Championship Gold Medal Winners"
  >
    <DxCommonAnnotationSettings
      :padding-left-right="0"
      :padding-top-bottom="0"
      type="image"
      color="transparent"
      tooltip-template="tooltipTemplate"
    >
      <DxImage
        :height="60"
        :width="90"
      />
      <DxBorder color="transparent"/>
    </DxCommonAnnotationSettings>
    <DxAnnotation
      v-for="item in annotations"
      :key="item.country"
      :argument="item.country"
      :data="item.data"
      :location="item.location"
      :offset-x="item.offsetX"
      :offset-y="item.offsetY"
      :color="item.color"
    >
      <DxImage :url="item.image"/>
      <DxBorder :color="item.borderColor"/>
      <DxShadow :opacity="item.shadowOpacity"/>
    </DxAnnotation>
    <DxSeries
      argument-field="country"
      value-field="gold"
    >
      <DxLabel
        :visible="true"
        :radial-offset="83"
        position="inside"
        background-color="transparent"
      >
        <DxFont
          :size="16"
          :weight="600"
        />
      </DxLabel>
    </DxSeries>
    <DxTooltip
      :padding-left-right="12"
      :padding-top-bottom="10"
    />
    <DxLegend :visible="false"/>
    <template #tooltipTemplate="{ data }">
      <TooltipTemplate :annotation="data"/>
    </template>
  </DxPieChart>
</template>

<script>

import DxPieChart, {
  DxCommonAnnotationSettings,
  DxAnnotation,
  DxImage,
  DxBorder,
  DxShadow,
  DxSeries,
  DxLabel,
  DxFont,
  DxTooltip,
  DxLegend
} from 'devextreme-vue/pie-chart';

import { dataSource, getAnnotationSources } from './data.js';
import TooltipTemplate from './TooltipTemplate.vue';

export default {
  components: {
    DxPieChart,
    DxCommonAnnotationSettings,
    DxAnnotation,
    DxImage,
    DxBorder,
    DxShadow,
    DxSeries,
    DxLabel,
    DxFont,
    DxTooltip,
    DxLegend,
    TooltipTemplate
  },
  data() {
    return {
      dataSource,
      annotations: getAnnotationSources()
    };
  }
};
</script>

<style>
#pie {
    height: 440px;
}
</style>
