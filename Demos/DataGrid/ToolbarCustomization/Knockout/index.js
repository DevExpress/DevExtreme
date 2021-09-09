window.onload = function () {
  const expanded = ko.observable(true);
  const expandButtonText = ko.observable('Collapse All');

  expanded.subscribe((newValue) => {
    expandButtonText(newValue ? 'Collapse All' : 'Expand All');
  });

  const viewModel = {
    totalCount: ko.observable(getGroupCount('CustomerStoreState')),
    dataGridOptions: {
      dataSource: orders,
      showBorders: true,
      grouping: {
        autoExpandAll: expanded,
      },
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
      onToolbarPreparing(e) {
        const dataGrid = e.component;

        e.toolbarOptions.items.unshift({
          location: 'before',
          template: 'totalGroupCount',
        }, {
          location: 'before',
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
            onValueChanged(event) {
              dataGrid.clearGrouping();
              dataGrid.columnOption(event.value, 'groupIndex', 0);
              viewModel.totalCount(getGroupCount(event.value));
            },
          },
        }, {
          location: 'before',
          widget: 'dxButton',
          options: {
            text: expandButtonText,
            width: 136,
            onClick() {
              expanded(!expanded());
            },
          },
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'refresh',
            onClick() {
              dataGrid.refresh();
            },
          },
        });
      },
    },
  };

  function getGroupCount(groupField) {
    return DevExpress.data.query(orders)
      .groupBy(groupField)
      .toArray().length;
  }

  ko.applyBindings(viewModel, document.getElementById('gridContainer'));
};
