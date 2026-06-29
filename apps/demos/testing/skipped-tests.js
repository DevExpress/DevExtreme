export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: [
      'RemoteGrouping',
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

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: [
      'SignalRService',
      'RemoteGrouping',
      'RemoteVirtualScrolling',
      'CustomDataSource',
      'AIColumns'
    ],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
  React: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: [
      'SignalRService',
      'RemoteGrouping',
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

    // Remote WidgetsGalleryDataService is unstable
    DataGrid: [
      'SignalRService',
      'RemoteGrouping',
      'RemoteVirtualScrolling',
      'CustomDataSource',
      'AIColumns'
    ],

    // AI answers are not stable
    TreeList: ['AIColumns'],
  },
};
