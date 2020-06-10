<template>
  <DxChart
    id="chart"
    :data-source="dataSource"
  >
    <DxTitle
      text="Apple Stock Price"
      subtitle="AAPL"
    />
    <DxCommonSeriesSettings
      argument-field="date"
      type="line"
    />
    <DxSeries
      value-field="close"
      name="AAPL"
    />
    <DxLegend :visible="false"/>
    <DxArgumentAxis argument-type="datetime"/>
    <DxValueAxis position="right"/>
    <DxCommonAnnotationSettings
      :customize-tooltip="customizeTooltip"
      series="AAPL"
      type="image"
    >
      <DxFont
        :size="16"
        :weight="600"
      />
      <DxImage
        :width="50.5"
        :height="105.75"
      />
    </DxCommonAnnotationSettings>
    <DxAnnotation
      v-for="annotation in annotationSources"
      :key="annotation.description"
      :argument="annotation.date"
      :type="annotation.type"
      :text="annotation.text"
      :description="annotation.description"
      :padding-top-bottom="annotation.padding"
      :offset-y="annotation.offset"
    >
      <DxImage :url="annotation.image"/>
    </DxAnnotation>
  </DxChart>
</template>
<script>
import { dataSource, annotationSources } from './data.js';
import { DxChart, DxTitle, DxCommonSeriesSettings, DxSeries, DxLegend, DxArgumentAxis, DxValueAxis, DxCommonAnnotationSettings, DxFont, DxImage, DxAnnotation } from 'devextreme-vue/chart';

export default {
  components: {
    DxChart, DxTitle, DxCommonSeriesSettings, DxSeries, DxLegend, DxArgumentAxis, DxValueAxis, DxCommonAnnotationSettings, DxFont, DxImage, DxAnnotation
  },
  data() {
    return {
      dataSource,
      annotationSources
    };
  },
  methods: {
    customizeTooltip(annotation) {
      return {
        html: `<div class='tooltip'>${annotation.description}</div>`
      };
    }
  }
};
</script>
<style scoped>
#chart {
    height: 440px;
}
.tooltip {
    width: 300px;
}
</style>
