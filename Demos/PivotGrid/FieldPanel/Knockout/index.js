window.onload = function () {
  const showDataFields = ko.observable(true);
  const showRowFields = ko.observable(true);
  const showColumnFields = ko.observable(true);
  const showFilterFields = ko.observable(true);

  const viewModel = {
    pivotGridOptions: {
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
          dataField: 'date',
          groupInterval: 'day',
          visible: false,
        }, {
          dataField: 'sales',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
        }],
        store: sales,
      },
      allowSortingBySummary: true,
      allowSorting: true,
      allowFiltering: true,
      showBorders: true,
      height: 490,
      fieldPanel: {
        showDataFields,
        showRowFields,
        showColumnFields,
        showFilterFields,
        allowFieldDragging: true,
        visible: true,
      },
      fieldChooser: {
        height: 500,
      },
      onContextMenuPreparing: contextMenuPreparing,
    },
    showDataFieldsOptions: {
      text: 'Show Data Fields',
      value: showDataFields,
    },
    showRowFieldsOptions: {
      text: 'Show Row Fields',
      value: showRowFields,
    },
    showColumnFieldsOptions: {
      text: 'Show Column Fields',
      value: showColumnFields,
    },
    showFilterFieldsOptions: {
      text: 'Show Filter Fields',
      value: showFilterFields,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('pivotgrid'));

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
