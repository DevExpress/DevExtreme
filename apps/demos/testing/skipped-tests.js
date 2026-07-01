export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['RemoteVirtualScrolling', 'CustomDataSource', 'AIColumns'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  Angular: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['RemoteVirtualScrolling', 'CustomDataSource', 'AIColumns'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['RemoteVirtualScrolling', 'CustomDataSource', 'AIColumns'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  Vue: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['RemoteVirtualScrolling', 'CustomDataSource', 'AIColumns'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
};
