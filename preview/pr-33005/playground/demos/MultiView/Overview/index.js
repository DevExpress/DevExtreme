$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  const multiView = $('#multiview-container').dxMultiView({
    height: 300,
    dataSource: multiViewItems,
    selectedIndex: 0,
    loop: false,
    animationEnabled: true,
    itemTemplate: $('#customer'),
    onSelectionChanged(e) {
      $('.selected-index')
        .text(e.component.option('selectedIndex') + 1);
    },
  }).dxMultiView('instance');

  $('#loop-enabled').dxCheckBox({
    value: false,
    text: 'Loop enabled',
    onValueChanged(e) {
      multiView.option('loop', e.value);
    },
  });

  $('#animation-enabled').dxCheckBox({
    value: true,
    text: 'Animation enabled',
    onValueChanged(e) {
      multiView.option('animationEnabled', e.value);
    },
  });

  $('.item-count').text(multiViewItems.length);
});
