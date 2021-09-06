$(() => {
  DevExpress.setTemplateEngine('underscore');

  const listData = [
    {
      data: new DevExpress.data.DataSource({
        store: contacts,
        sort: 'name',
      }),
    }, {
      data: new DevExpress.data.DataSource({
        store: contacts,
        sort: 'name',
        filter: ['category', '=', 'Missed'],
      }),
    }, {
      data: new DevExpress.data.DataSource({
        store: contacts,
        sort: 'name',
        filter: ['category', '=', 'Favorites'],
      }),
    },
  ];

  const list = $('#list').dxList({
    dataSource: listData[0].data,
    itemTemplate: $('#item-template'),
  }).dxList('instance');

  $('#navbar').dxNavBar({
    dataSource: navData,
    selectedIndex: 0,
    onItemClick(e) {
      list.option('dataSource', listData[e.itemIndex].data);
    },
  });
});
