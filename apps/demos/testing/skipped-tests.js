export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
  },
  Angular: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
  },
  Vue: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
  },
};
