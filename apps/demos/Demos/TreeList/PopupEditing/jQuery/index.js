$(() => {
  $('#employees').dxTreeList({
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    editing: {
      mode: 'popup',
      allowUpdating: true,
      allowDeleting: (args) => args.row.data.ID !== 1,
      allowAdding: true,
      popup: {
        title: 'Employee Info',
        showTitle: true,
        width: 700,
      },
    },
    columnAutoWidth: true,
    showRowLines: true,
    showBorders: true,
    columns: [{
      dataField: 'Full_Name',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'Prefix',
      caption: 'Title',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'Head_ID',
      caption: 'Head',
      visible: false,
      lookup: {
        dataSource: {
          store: employees,
          sort: 'Full_Name',
        },
        valueExpr: 'ID',
        displayExpr: 'Full_Name',
      },
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'Title',
      caption: 'Position',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'City',
      width: 150,
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'Hire_Date',
      dataType: 'date',
      width: 120,
      validationRules: [{ type: 'required' }],
    }, {
      type: 'buttons',
      buttons: ['edit', 'delete'],
    },
    ],
    onEditorPreparing(e) {
      if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },
    onInitNewRow(e) {
      e.data.Head_ID = 1;
    },
    expandedRowKeys: [1],
  });
});
