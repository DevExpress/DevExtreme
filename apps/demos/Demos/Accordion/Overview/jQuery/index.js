$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  const tagBox = $('#tagbox').dxTagBox({
    dataSource: accordionItems,
    displayExpr: 'CompanyName',
    disabled: true,
    value: [accordionItems[0]],
    inputAttr: { 'aria-label': 'Company Name' },
    onValueChanged(e) {
      accordion.option('selectedItems', e.value);
    },
  }).dxTagBox('instance');

  const accordion = $('#accordion-container').dxAccordion({
    dataSource: accordionItems,
    animationDuration: 300,
    collapsible: false,
    multiple: false,
    selectedItems: [accordionItems[0]],
    itemTitleTemplate: $('#title'),
    itemTemplate: $('#customer'),
    onSelectionChanged(e) {
      tagBox.option('value', e.component.option('selectedItems'));
    },
  }).dxAccordion('instance');

  $('#slider').dxSlider({
    min: 0,
    max: 1000,
    value: 300,
    label: { visible: true },
    tooltip: {
      enabled: true,
      position: 'bottom',
    },
    onValueChanged(e) {
      accordion.option('animationDuration', e.value);
    },
  });

  $('#multiple-enabled').dxCheckBox({
    text: 'Multiple enabled',
    onValueChanged(e) {
      accordion.option('multiple', e.value);
      tagBox.option('disabled', !e.value);
      tagBox.option('value', accordion.option('selectedItems'));
    },
  });

  $('#collapsible-enabled').dxCheckBox({
    text: 'Collapsible enabled',
    onValueChanged(e) {
      accordion.option('collapsible', e.value);
    },
  });
});
