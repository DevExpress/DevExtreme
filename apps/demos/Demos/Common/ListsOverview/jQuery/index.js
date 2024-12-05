$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  const tile = $('.tile').dxTileView({
    noDataText: '',
    height: 224,
    baseItemHeight: 100,
    baseItemWidth: 137,
    itemMargin: 12,
    itemTemplate: $('#tile-template'),
  }).dxTileView('instance');

  const list = $('.list').dxList({
    dataSource,
    grouped: true,
    searchEnabled: true,
    itemTemplate: $('#list-template'),
    selectionMode: 'single',
    onSelectionChanged: selectionChanged,
  }).dxList('instance');

  function selectionChanged(e) {
    const hotel = e.addedItems[0];
    tile.option('dataSource', hotel.Images);
    $('.header .name').text(hotel.Hotel_Name);
    $('.header .price').text(`$${hotel.Price}`);
    $('.header .type').removeClass('diamond platinum gold');
    $('.header .type').addClass(hotel.Hotel_Class.toLowerCase());
    $('.description').text(hotel.Description);
    $('.right .address').text(`${hotel.Postal_Code}, ${hotel.Address}`);
  }

  list.selectItem({ group: 0, item: 0 });
});
