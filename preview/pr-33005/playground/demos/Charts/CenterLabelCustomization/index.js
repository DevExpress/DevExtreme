$(() => {
  const formatNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format;
  const commonSettings = {
    innerRadius: 0.65,
    resolveLabelOverlapping: 'shift',
    sizeGroup: 'piesGroup',
    legend: {
      visible: false,
    },
    type: 'doughnut',
    series: [{
      argumentField: 'commodity',
      valueField: 'total',
      label: {
        visible: true,
        connector: {
          visible: true,
        },
        format: 'fixedPoint',
        backgroundColor: 'none',
        customizeText(e) {
          return `${e.argumentText}\n${e.valueText}`;
        },
      },
    }],
    centerTemplate(pieChart, container) {
      const total = pieChart
        .getAllSeries()[0]
        .getVisiblePoints()
        .reduce((s, p) => s + p.originalValue, 0);
      const { country } = pieChart.getAllSeries()[0].getVisiblePoints()[0].data;

      const circle = createElement('circle', {
        cx: 100,
        cy: 100,
        fill: '#eee',
        r: pieChart.getInnerRadius() - 6,
      });
      const image = createElement('image', {
        x: 70,
        y: 58,
        width: 60,
        height: 40,
        href: `../../../../images/flags/${country.replace(/\s/, '').toLowerCase()}.svg`,
      });
      const text = createText({
        x: 100,
        y: 120,
        fill: '#494949',
        'text-anchor': 'middle',
        'font-size': 18,
      }, [country, formatNumber(total)]);

      container.appendChild(circle);
      container.appendChild(image);
      container.appendChild(text);
    },
  };

  function createElement(type, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);
    Object.keys(attributes).forEach((attributeName) => {
      element.setAttribute(attributeName, attributes[attributeName]);
    });
    return element;
  }

  function createText(attributes, contents) {
    const text = createElement('text', attributes);

    const tspan1 = createElement('tspan', { x: attributes.x, dy: 0 });
    tspan1.textContent = contents[0];

    const tspan2 = createElement('tspan', { x: attributes.x, dy: 20, 'font-weight': 600 });
    tspan2.textContent = contents[1];

    text.appendChild(tspan1);
    text.appendChild(tspan2);

    return text;
  }

  $('#countries')
    .dxPieChart($.extend({}, commonSettings, {
      dataSource: {
        store: data,
        filter: ['country', '=', 'France'],
      },
    }));

  $('#waterLandRatio')
    .dxPieChart($.extend({}, commonSettings, {
      dataSource: {
        store: data,
        filter: ['country', '=', 'Germany'],
      },
    }));
});
