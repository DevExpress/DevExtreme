<template>
  <DxPieChart
    id="pie"
    :data-source="data"
    :customize-point="customizePoint"
  >
    <DxSeries
      argument-field="type"
      value-field="value"
    >
      <DxLabel
        :visible="true"
        :customize-text="customizeText"
      >
        <DxConnector :visible="true"/>
      </DxLabel>
    </DxSeries>
    <DxExport :enabled="true"/>
  </DxPieChart>
</template>
<script>

import DxPieChart, {
  DxSeries,
  DxLabel,
  DxConnector,
  DxExport,
} from 'devextreme-vue/pie-chart';
import { registerGradient, registerPattern } from 'devextreme/common/charts';
import { data } from './data.js';

const imagePatternSize = 12;
const shapePatternSize = 6;

export default {
  components: {
    DxPieChart,
    DxExport,
    DxConnector,
    DxLabel,
    DxSeries,
  },
  data() {
    return {
      data,
    };
  },
  methods: {
    customizePoint(point) {
      const color = point.series.getPointsByArg(point.argument)[0].getColor();
      let fillId;
      switch (point.argument) {
        case 'Stripes':
          fillId = this.getStrokePattern(color);
          break;
        case 'Grid':
          fillId = this.getSquarePattern(color);
          break;
        case 'Linear Gradient':
          fillId = this.getLinearGradient(color);
          break;
        case 'Radial Gradient':
          fillId = this.getRadialGradient(color);
          break;
        case 'Image':
          fillId = this.getPatternImage(color);
          break;
        default:
          break;
      }

      return { color: { fillId } };
    },

    customizeText(info) {
      return info.argument;
    },

    hexToRgb(hex, opacity = 1) {
      const hexColorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return `rgba(${parseInt(hexColorParts[1], 16)}, ${parseInt(hexColorParts[2], 16)}, ${parseInt(hexColorParts[3], 16)}, ${opacity})`;
    },

    getGradient(type, color1, color2) {
      return registerGradient(type, {
        colors: [{
          offset: '20%',
          color: color1,
        }, {
          offset: '90%',
          color: color2,
        }],
      });
    },

    getLinearGradient(color) { return this.getGradient('linear', color, this.hexToRgb(color, 0.5)); },

    getRadialGradient(color) { return this.getGradient('radial', this.hexToRgb(color, 0.5), color); },

    getPatternImage(color) {
      return registerPattern({
        width: imagePatternSize,
        height: imagePatternSize,
        template: (container) => {
          const rect = this.createRect(imagePatternSize, color);
          const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          image.setAttribute('x', 0);
          image.setAttribute('y', 0);
          image.setAttribute('width', imagePatternSize);
          image.setAttribute('height', imagePatternSize);
          image.setAttribute('href', '../../../../images/Charts/PieWithCustomStyles/diamond.svg');
          image.setAttribute('opacity', '0.6');

          container.appendChild(rect);
          container.appendChild(image);
        },
      });
    },

    getStrokePattern(color) {
      return registerPattern({
        width: shapePatternSize,
        height: shapePatternSize,
        template: (container) => {
          const halfSize = shapePatternSize / 2;
          const oneAndAHalfSize = shapePatternSize * 1.5;
          const d = `M ${halfSize} ${-halfSize} L ${-halfSize} ${halfSize} M 0 ${shapePatternSize} L ${shapePatternSize} 0 M ${oneAndAHalfSize} ${halfSize} L ${halfSize} ${oneAndAHalfSize}`;
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

          path.setAttribute('stroke', color);
          path.setAttribute('stroke-width', 2);
          path.setAttribute('d', d);
          container.appendChild(path);
        },
      });
    },

    getSquarePattern(color) {
      return registerPattern({
        width: shapePatternSize,
        height: shapePatternSize,
        template: (container) => {
          const rect = this.createRect(shapePatternSize, null, color, 2);
          container.appendChild(rect);
        },
      });
    },

    createRect(size, fill, stroke, strokeWidth) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

      rect.setAttribute('x', 0);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', size);
      rect.setAttribute('height', size);
      rect.setAttribute('fill', fill);
      rect.setAttribute('stroke', stroke);
      rect.setAttribute('stroke-width', strokeWidth);

      return rect;
    },
  },
};
</script>

<style>
#pie {
  height: 440px;
}
</style>
