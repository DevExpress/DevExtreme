export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // AI answers are not stable
    DataGrid: ['AIColumns'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],

    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['SignalRService', 'AIColumns'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['SignalRService', 'AIColumns'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],

    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: ['SignalRService', 'AIColumns'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
};
