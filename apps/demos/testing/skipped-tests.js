export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],
  },
  Angular: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet.
    // StandaloneFieldChooser demo is stubbed out (see the TODO in its app.component.ts) pending a devextreme-angular fix
    PivotGrid: ['WebAPIService', 'StandaloneFieldChooser'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],
  },
  Vue: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],

    // Remote WidgetsGalleryDataService is unstable and not mocked yet
    PivotGrid: ['WebAPIService'],
  },
};
