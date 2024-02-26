$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  const treeViewWidget = $('#treeview').dxTreeView({
    dataSource: continents,
    width: 200,
    displayExpr: 'text',
  }).dxTreeView('instance');

  const menuWidget = $('#menu').dxMenu({
    dataSource: continents,
  }).dxMenu('instance');

  const arabicAccordionOptions = {
    rtlEnabled: true,
    itemTitleTemplate(data, index, element) {
      const $item = $('<div>').text(data.nameAr);
      element.append($item);
    },
    itemTemplate: $('#arabic-accordion-template'),
  };

  const englishAccordionOptions = {
    rtlEnabled: false,
    itemTitleTemplate(data, index, element) {
      const $item = $('<div>').text(data.nameEn);
      element.append($item);
    },
    itemTemplate: $('#english-accordion-template'),
  };

  const accordionWidget = $('#accordion').dxAccordion(
    $.extend({
      dataSource: europeCountries,
    },
    englishAccordionOptions),
  ).dxAccordion('instance');

  const languages = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];

  $('#select-language').dxSelectBox({
    items: languages,
    value: languages[1],
    inputAttr: { 'aria-label': 'Language' },
    onValueChanged(data) {
      const isRTL = data.value === languages[0];

      $('.demo-container').toggleClass('dx-rtl', isRTL);

      $.each([treeViewWidget, menuWidget], (_, instance) => {
        instance.option('rtlEnabled', isRTL);
        instance.option('displayExpr', isRTL ? 'textAr' : 'text');
      });

      accordionWidget.option(isRTL
        ? arabicAccordionOptions
        : englishAccordionOptions);
    },
  });
});
