$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'ID',
      loadUrl: `${url}/Tasks`,
      updateUrl: `${url}/UpdateTask`,
      insertUrl: `${url}/InsertTask`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
    showBorders: true,
    paging: {
      enabled: true,
      pageSize: 15,
    },
    pager:{
      visible: true,
    },
    headerFilter: {
      visible: true,
    },
    searchPanel: {
      visible: true,
    },
    editing: {
      mode: 'cell',
      allowUpdating: true,
      allowAdding: true,
    },
    onRowInserted(e) {
      e.component.navigateToRow(e.key);
    },
    columns: [{
      dataField: 'Owner',
      width: 150,
      allowSorting: false,
      lookup: {
        dataSource: employees,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      validationRules: [{ type: 'required' }],
      editCellTemplate: dropDownBoxEditorTemplate,
    }, {
      dataField: 'AssignedEmployee',
      caption: 'Assignees',
      width: 200,
      allowSorting: false,
      editCellTemplate: tagBoxEditorTemplate,
      lookup: {
        dataSource: employees,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      validationRules: [{ type: 'required' }],
      cellTemplate(container, options) {
        const noBreakSpace = '\u00A0';

        const assignees = (options.value || []).map(
          (assigneeId) => options.column.lookup.calculateCellValue(assigneeId),
        );
        const text = assignees.join(', ');

        container.text(text || noBreakSpace).attr('title', text);
      },
      calculateFilterExpression(filterValue, selectedFilterOperation, target) {
        if (target === 'search' && typeof (filterValue) === 'string') {
          return [this.dataField, 'contains', filterValue];
        }
        return function (rowData) {
          return (rowData.AssignedEmployee || []).indexOf(filterValue) !== -1;
        };
      },
    }, {
      dataField: 'Subject',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'Status',
      lookup: {
        dataSource: statuses,
        valueExpr: 'id',
        displayExpr: 'name',
      },
      validationRules: [{ type: 'required' }],
      width: 200,
      editorOptions: {
        itemTemplate(itemData, itemIndex, itemElement) {
          if (itemData != null) {
            const imageContainer = $('<span>').addClass('status-icon middle').appendTo(itemElement);
            $('<img>').attr('src', `images/icons/status-${itemData.id}.svg`).appendTo(imageContainer);
            $('<span>').addClass('middle').text(itemData.name).appendTo(itemElement);
          } else {
            $('<span>').text('(All)').appendTo(itemElement);
          }
        },
      },
    },
    ],
  });

  function dropDownBoxEditorTemplate(cellElement, cellInfo) {
    const selectedRowKeys = cellInfo.value !== null && cellInfo.value !== undefined ? [cellInfo.value] : []
    return $('<div>').dxDropDownBox({
      dropDownOptions: { width: 500 },
      dataSource: employees,
      value: cellInfo.value,
      valueExpr: 'ID',
      displayExpr: 'FullName',
      inputAttr: { 'aria-label': 'Owner' },
      contentTemplate(e) {
        return $('<div>').dxDataGrid({
          dataSource: employees,
          remoteOperations: true,
          columns: ['FullName', 'Title', 'Department'],
          hoverStateEnabled: true,
          scrolling: { mode: 'virtual' },
          height: 250,
          selection: { mode: 'single' },
          selectedRowKeys: selectedRowKeys,
          focusedRowEnabled: true,
          focusedRowKey: cellInfo.value,
          onContextMenuPreparing: (e) => {
            e.items = [];
          },
          onSelectionChanged(selectionChangedArgs) {
            e.component.option('value', selectionChangedArgs.selectedRowKeys[0]);
            cellInfo.setValue(selectionChangedArgs.selectedRowKeys[0]);
            if (selectionChangedArgs.selectedRowKeys.length > 0) {
              e.component.close();
            }
          },
        });
      },
    });
  }

  function tagBoxEditorTemplate(cellElement, cellInfo) {
    return $('<div>').dxTagBox({
      dataSource: employees,
      value: cellInfo.value,
      valueExpr: 'ID',
      displayExpr: 'FullName',
      inputAttr: { 'aria-label': 'Name' },
      showSelectionControls: true,
      maxDisplayedTags: 3,
      showMultiTagOnly: false,
      applyValueMode: 'useButtons',
      searchEnabled: true,
      onValueChanged(e) {
        cellInfo.setValue(e.value);
      },
      onSelectionChanged() {
        cellInfo.component.updateDimensions();
      },
    });
  }
});
