$(() => {
  const { format } = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
  });

  $('#vector-map').dxVectorMap({
    layers: {
      name: 'areas',
      dataSource: DevExpress.viz.map.sources.world,
      palette: 'violet',
      colorGroups: [0, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000],
      colorGroupingField: 'total',
      label: {
        enabled: true,
        dataField: 'name',
      },
      customize(elements) {
        $.each(elements, (_, element) => {
          const countryGDPData = countriesGDP[element.attribute('name')];
          element.attribute('total', (countryGDPData && countryGDPData.total) || 0);
        });
      },
    },
    legends: [{
      source: { layer: 'areas', grouping: 'color' },
      customizeText(arg) {
        return `${format(arg.start)} to ${format(arg.end)}`;
      },
    }],
    title: {
      text: 'Nominal GDP',
      subtitle: {
        text: '(in millions of US dollars)',
      },
    },
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      contentTemplate(info, container) {
        const name = info.attribute('name');
        const countryGDPData = countriesGDP[name];

        const node = $('<div>')
          .append(`<h4>${name}</h4>`)
          .appendTo(container);

        const total = countryGDPData && countryGDPData.total;
        if (total) {
          $("<div id='nominal'></div>")
            .text(`Nominal GDP: $${format(total)}M`)
            .appendTo(node);
        }
        if (countryGDPData) {
          const GDPData = [
            { name: 'industry', value: countriesGDP[name].industry },
            { name: 'services', value: countriesGDP[name].services },
            { name: 'agriculture', value: countriesGDP[name].agriculture },
          ];
          $("<div id='gdp-sectors'></div>")
            .appendTo(node)
            .dxPieChart({
              dataSource: GDPData,
              animation: false,
              series: [{
                valueField: 'value',
                argumentField: 'name',
                label: {
                  visible: true,
                  connector: {
                    visible: true,
                    width: 1,
                  },
                  customizeText(pointInfo) {
                    return `${pointInfo.argument[0].toUpperCase()
                                            + pointInfo.argument.slice(1)
                    }: $${pointInfo.value}M`;
                  },
                },
              }],
              legend: {
                visible: false,
              },
            });
        } else {
          node.append('<div>No economic development data</div>');
        }
      },
    },
    bounds: [-180, 85, 180, -60],
  });
});
