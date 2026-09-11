const { NgModule, provideZoneChangeDetection } = require('@angular/core');

const ZoneTestingModule = NgModule({
  providers: [provideZoneChangeDetection()],
})(class ZoneTestingModule {});

module.exports = { ZoneTestingModule };
