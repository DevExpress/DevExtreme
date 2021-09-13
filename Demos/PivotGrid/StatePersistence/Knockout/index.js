window.onload = function () {
  const viewModel = {
    pivotOptions: {
      allowSortingBySummary: true,
      allowSorting: true,
      allowFiltering: true,
      allowExpandAll: true,
      showBorders: true,
      onContextMenuPreparing: contextMenuPreparing,
      height: 570,
      fieldChooser: {
        enabled: true,
      },
      fieldPanel: {
        visible: true,
      },
      stateStoring: {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dx-widget-gallery-pivotgrid-storing',
      },
      dataSource: {
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
          sortBySummaryField: 'sales',
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          groupName: 'date',
          groupInterval: 'year',
        }, {
          groupName: 'date',
          groupInterval: 'quarter',
        }, {
          dataField: 'sales',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
        }],
        store: sales,
      },
    },
    resetOptions: {
      text: "Reset the PivotGrid's State",
      onClick() {
        $('#pivotgrid').dxPivotGrid('instance').getDataSource().state({});
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('pivotgrid-demo'));

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
};
