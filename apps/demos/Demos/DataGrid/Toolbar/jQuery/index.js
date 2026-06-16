$(() => {
  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: orders,
    keyExpr: 'ID',
    showBorders: true,
    columnChooser: {
      enabled: true,
    },
    loadPanel: {
      enabled: true,
    },
    columns: [{
      dataField: 'OrderNumber',
      caption: 'Invoice Number',
    }, 'OrderDate', 'Employee', {
      caption: 'City',
      dataField: 'CustomerStoreCity',
    }, {
      caption: 'State',
      groupIndex: 0,
      dataField: 'CustomerStoreState',
    }, {
      dataField: 'SaleAmount',
      alignment: 'right',
      format: 'currency',
    }],
    toolbar: {
      items: [
        {
          location: 'before',
          template() {
            return $('<div>')
              .addClass('informer')
              .append(
                $('<div>')
                  .addClass('count')
                  .text(getGroupCount('CustomerStoreState')),
                $('<span>')
                  .text('Total Count'),
              );
          },
        }, {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxSelectBox',
          options: {
            width: 225,
            items: [{
              value: 'CustomerStoreState',
              text: 'Grouping by State',
            }, {
              value: 'Employee',
              text: 'Grouping by Employee',
            }],
            displayExpr: 'text',
            valueExpr: 'value',
            value: 'CustomerStoreState',
            onValueChanged(e) {
              dataGrid.clearGrouping();
              dataGrid.columnOption(e.value, 'groupIndex', 0);
              $('.informer .count').text(getGroupCount(e.value));
            },
          },
        }, {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxButton',
          options: {
            text: 'Collapse All',
            width: 136,
            onClick(e) {
              const expanding = e.component.option('text') === 'Expand All';
              dataGrid.option('grouping.autoExpandAll', expanding);
              e.component.option('text', expanding ? 'Collapse All' : 'Expand All');
            },
          },
        }, {
          location: 'after',
          locateInMenu: 'auto',
          showText: 'inMenu',
          widget: 'dxButton',
          options: {
            icon: 'refresh',
            text: 'Refresh',
            onClick() {
              dataGrid.refresh();
            },
          },
        },
        'columnChooserButton',
      ],
    },
  }).dxDataGrid('instance');

  function getGroupCount(groupField) {
    return DevExpress.data.query(orders)
      .groupBy(groupField)
      .toArray().length;
  }
});
