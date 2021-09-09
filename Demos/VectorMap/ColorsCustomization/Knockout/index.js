window.onload = function () {
  const viewModel = {
    vectorMapOptions: {
      bounds: [-180, 85, 180, -60],
      tooltip: {
        enabled: true,
        border: {
          visible: false,
        },
        font: { color: '#fff' },
        customizeTooltip(arg) {
          const name = arg.attribute('name');
          const country = countries[name];
          if (country) {
            return { text: `${name}: ${country.totalArea}M km&#178`, color: country.color };
          }
          return null;
        },
      },
      layers: {
        dataSource: DevExpress.viz.map.sources.world,
        customize(elements) {
          elements.forEach((element) => {
            const country = countries[element.attribute('name')];
            if (country) {
              element.applySettings({
                color: country.color,
                hoveredColor: '#e0e000',
                selectedColor: '#008f00',
              });
            }
          });
        },
      },
      onClick(e) {
        const { target } = e;
        if (target && countries[target.attribute('name')]) {
          target.selected(!target.selected());
        }
      },
    },
  };

  ko.applyBindings(viewModel, $('#vector-map-demo').get(0));
};
