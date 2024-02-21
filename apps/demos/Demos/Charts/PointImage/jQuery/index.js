$(() => {
  $('#chart').dxChart({
    dataSource,
    commonSeriesSettings: {
      argumentField: 'year',
      valueField: 'place',
      type: 'spline',
      point: {
        visible: false,
      },
    },
    export: {
      enabled: true,
      formats: ['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'],
    },
    customizePoint() {
      if (this.value === 1) {
        return { image: { url: '../../../../images/Charts/PointImage/icon-medal-gold.png', width: 20, height: 20 }, visible: true };
      }
      if (this.value === 2) {
        return { image: { url: '../../../../images/Charts/PointImage/icon-medal-silver.png', width: 20, height: 20 }, visible: true };
      }
      if (this.value === 3) {
        return { image: { url: '../../../../images/Charts/PointImage/icon-medal-bronse.png', width: 20, height: 20 }, visible: true };
      }
      return null;
    },
    series: {
      color: '#888888',
    },
    title: {
      text: 'Canadian Men’s National Ice Hockey Team\n at the World Championships',
    },
    legend: {
      visible: false,
    },
    argumentAxis: {
      grid: {
        visible: true,
      },
      label: {
        format: {
          type: 'decimal',
        },
      },
      allowDecimals: false,
      axisDivisionFactor: 60,
    },
    valueAxis: {
      grid: {
        visible: false,
      },
      inverted: true,
      label: {
        customizeText() {
          if (this.valueText === '1') {
            return `${this.valueText}st place`;
          } if (this.valueText === '2') {
            return `${this.valueText}nd place`;
          } if (this.valueText === '3') {
            return `${this.valueText}rd place`;
          }
          return `${this.valueText}th place`;
        },
      },
    },
  });
});
