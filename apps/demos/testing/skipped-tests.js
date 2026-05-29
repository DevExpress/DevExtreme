export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
    PivotGrid: ['WebAPIService'],
  },
  Angular: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
    PivotGrid: ['WebAPIService'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
    PivotGrid: ['WebAPIService'],
  },
  Vue: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: ['RemoteGrouping', 'RemoteVirtualScrolling', 'CustomDataSource'],
    PivotGrid: ['WebAPIService'],
  },
};
