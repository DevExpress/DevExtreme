$(() => {
  const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridSemanticSearch';

  let searchValue = '';
  let similarityFactor = 0.31;

  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'ID',
      loadUrl: `${url}/Get`,
      loadParams: {
        searchValue: () => searchValue,
        similarityFactor: () => similarityFactor,
      },
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
    showBorders: true,
    remoteOperations: true,
    height: 600,
    columns: [{
      dataField: 'ID',
      width: 50
    }, {
      dataField: 'Name'
    }, {
      dataField: 'Description'
    }],
    scrolling: {
      mode: 'virtual',
    },
    searchPanel: {
      visible: true,
    },
    toolbar: {
      items: [
        {
          location: 'before',
          template: function (data, container) {
            $('<span>')
              .text('Similarity Factor:')
              .css('margin-right', '8px')
              .appendTo(container);
            $('<div>')
              .appendTo(container)
              .dxNumberBox({
                value: similarityFactor,
                min: 0,
                max: 1,
                format: '0.00',
                step: 0.05,
                showSpinButtons: true,
                inputAttr: { 'aria-label': 'Similarity Factor' },
                onValueChanged(e) {
                  similarityFactor = e.value;
                  if (searchValue !== '') {
                    dataGrid.getDataSource().reload();
                  }
                },
              });
          }
        },
        {
          name: 'searchPanel',
        },
      ],
    },
    onEditorPreparing(e) {
      if (e.parentType === 'searchPanel') {
        let searchTimeout;
        e.editorOptions.onValueChanged = (args) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            searchValue = args.value;
            e.component.getDataSource().reload();
          }, e.updateValueTimeout);
        };
        e.editorOptions.placeholder = 'Try: clothing';
      }
    },
  }).dxDataGrid('instance');
});
