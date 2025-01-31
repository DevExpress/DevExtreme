
<template>
  <div id="chart-demo">
    <div class="chart_environment">
      <Form ref="form"/>
      <DxChart
        id="chart"
        ref="chart"
        :data-source="dataSource"
        palette="Violet"
      >
        <DxCommonSeriesSettings
          :bar-padding="0.3"
          argument-field="state"
          type="bar"
        />
        <DxSeries
          value-field="year1990"
          name="1990"
        />
        <DxSeries
          value-field="year2000"
          name="2000"
        />
        <DxSeries
          value-field="year2010"
          name="2010"
        />
        <DxSeries
          value-field="year2016"
          name="2016"
        />
        <DxSeries
          value-field="year2017"
          name="2017"
        />
        <DxLegend
          vertical-alignment="bottom"
          horizontal-alignment="center"
        />
        <DxTitle
          text="Oil Production"
          subtitle="(in millions tonnes)"
        />
      </DxChart>
    </div>
    <div class="controls-pane">
      <DxButton
        id="export"
        :width="145"
        icon="export"
        type="default"
        text="Export"
        @click="onClick()"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLegend,
  DxTitle,
} from 'devextreme-vue/chart';
import { exportFromMarkup } from 'devextreme/viz/export';
import DxButton from 'devextreme-vue/button';
import { Canvg } from 'canvg';
import { dataSource } from './data.ts';
import Form from './Form.vue';

const form = ref();
const chart = ref();

const prepareMarkup = (chartSVG, markup) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.setAttribute('version', '1.1');
  svg.setAttribute('width', '820px');
  svg.setAttribute('height', '420px');
  svg.innerHTML = markup;

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', 'translate(305,12)');
  group.innerHTML = chartSVG;
  svg.appendChild(group);

  return svg;
};

function onClick() {
  const chartSVG = chart.value.instance.svg();
  const formContent = form.value.getMarkup();

  exportFromMarkup(prepareMarkup(chartSVG, formContent), {
    width: 820,
    height: 420,
    margin: 0,
    format: 'png',
    svgToCanvas(svg, canvas) {
      return new Promise((resolve) => {
        const v = Canvg.fromString(
            canvas.getContext("2d"),
            new XMLSerializer().serializeToString(svg)
        );

        resolve(v.render());
      });
    },
  });
}
</script>
<style>
#chart-demo {
  height: 460px;
}

#chart {
  position: absolute;
  top: 12px;
  right: 35px;
  width: 480px;
  height: 347px;
}

.chart_environment {
  width: 820px;
  position: relative;
  margin: 0 auto;
}

.controls-pane {
  display: block;
  text-align: center;
}
</style>

