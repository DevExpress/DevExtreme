$(() => {
  const pagination = $('#pagination')
    .dxPagination({
      showInfo: true,
      lightModeEnabled: false,
      pagesNavigatorVisible: true,
      showNavigationButtons: true,
      allowedPageSizes: [4, 6],
      itemCount: employees.length,
      pageIndex: 1,
      pageSize: 4,
      onOptionChanged: (evt) => {
        if (evt.name === 'pageSize') {
          const pageSize = evt.value;
          const pageIndex = pagination.option('pageIndex');
          pagination.option('pageSize', pageSize);

          renderEmployeeGallery(pageSize, pageIndex);
        }

        if (evt.name === 'pageIndex') {
          const pageSize = pagination.option('pageSize');
          const pageIndex = evt.value;
          pagination.option('pageIndex', pageIndex);

          renderEmployeeGallery(pageSize, pageIndex);
        }
      },
    })
    .dxPagination('instance');
  
  renderEmployeeGallery(pagination.option('pageSize'), pagination.option('pageIndex'));
});
