$(() => {
  const salesPivotGrid = $('#sales').dxPivotGrid({
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    height: 490,
    showBorders: true,
    fieldPanel: {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowFieldDragging: true,
      visible: true,
    },
    fieldChooser: {
      height: 500,
    },
    dataSource: {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
        selector(data) {
          return `${data.city} (${data.country})`;
        },
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        dataField: 'sales',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: sales,
    },
    onContextMenuPreparing: contextMenuPreparing,
  }).dxPivotGrid('instance');

  $('#show-data-fields').dxCheckBox({
    text: 'Show Data Fields',
    value: true,
    onValueChanged(data) {
      salesPivotGrid.option('fieldPanel.showDataFields', data.value);
    },
  });

  $('#show-row-fields').dxCheckBox({
    text: 'Show Row Fields',
    value: true,
    onValueChanged(data) {
      salesPivotGrid.option('fieldPanel.showRowFields', data.value);
    },
  });

  $('#show-column-fields').dxCheckBox({
    text: 'Show Column Fields',
    value: true,
    onValueChanged(data) {
      salesPivotGrid.option('fieldPanel.showColumnFields', data.value);
    },
  });

  $('#show-filter-fields').dxCheckBox({
    text: 'Show Filter Fields',
    value: true,
    onValueChanged(data) {
      salesPivotGrid.option('fieldPanel.showFilterFields', data.value);
    },
  });

  function contextMenuPreparing(e) {
    const dataSource = e.component.getDataSource();
    const sourceField = e.field;

    if (sourceField) {
      if (!sourceField.groupName || sourceField.groupIndex === 0) {
        e.items.push({
          text: 'Hide field',
          onItemClick() {
            let fieldIndex;
            if (sourceField.groupName) {
              fieldIndex = dataSource
                .getAreaFields(sourceField.area, true)[sourceField.areaIndex]
                .index;
            } else {
              fieldIndex = sourceField.index;
            }

            dataSource.field(fieldIndex, {
              area: null,
            });
            dataSource.load();
          },
        });
      }

      if (sourceField.dataType === 'number') {
        const setSummaryType = function (args) {
          dataSource.field(sourceField.index, {
            summaryType: args.itemData.value,
          });

          dataSource.load();
        };
        const menuItems = [];

        e.items.push({ text: 'Summary Type', items: menuItems });

        $.each(['Sum', 'Avg', 'Min', 'Max'], (_, summaryType) => {
          const summaryTypeValue = summaryType.toLowerCase();

          menuItems.push({
            text: summaryType,
            value: summaryType.toLowerCase(),
            onItemClick: setSummaryType,
            selected: e.field.summaryType === summaryTypeValue,
          });
        });
      }
    }
  }
});
