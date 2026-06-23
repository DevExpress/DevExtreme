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
    columns: ['ID', 'Name', 'Description'],
    scrolling: {
      mode: 'virtual',
    },
    searchPanel: {
      visible: true,
    },
    toolbar: {
      items: [
        {
          location: 'after',
          cssClass: 'align-bottom',
          template: function (data, container) {
            $('<div>')
              .appendTo(container)
              .dxNumberBox({
                label: 'Similarity Factor',
                labelMode: 'floating',
                value: similarityFactor,
                min: 0,
                max: 1,
                format: '0.00',
                step: 0.05,
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
          cssClass: 'align-bottom',
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
