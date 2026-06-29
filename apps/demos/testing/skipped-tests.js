export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: [
      'RemoteVirtualScrolling',
      'CustomDataSource',
      'AIColumns'
    ],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: [
      'SignalRService',
      'RemoteVirtualScrolling',
      'CustomDataSource',
      'AIColumns'
    ],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  React: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: [
      'SignalRService',
      'RemoteVirtualScrolling',
      'CustomDataSource',
      'AIColumns'
    ],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable (RemoteGrouping is covered by a separate mocked test)
    DataGrid: [
      'SignalRService',
      'RemoteVirtualScrolling',
      'CustomDataSource',
      'AIColumns'
    ],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
};
