$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  $('#treeview').dxTreeView({
    dataSource: continents,
    selectionMode: 'single',
    selectByClick: true,
    onItemSelectionChanged(e) {
      showCountryData(e.itemData);
    },
  });

  const tabPanel = $('#tabpanel').dxTabPanel({
    animationEnabled: true,
    itemTitleTemplate: $('#title'),
    itemTemplate: $('#city-template'),
  }).dxTabPanel('instance');

  showCountryData(continents[0].items[0]);

  function showCountryData(data) {
    const citiesData = data.cities;
    if (citiesData) {
      $('#country-flag').attr('src', data.flag);
      $('#full-country-name').text(data.fullName);
      $('#country-description').text(data.description);

      $('#country-area').text(data.area);
      $('#country-population').text(data.population);
      $('#country-gdp').text(`$${data.gdp}`);

      tabPanel.option('dataSource', citiesData);
      tabPanel.option('selectedIndex', 0);
    }
  }
});
