const { NgModule, provideZoneChangeDetection } = require('@angular/core');

class ZoneTestingModule {}

NgModule({
  providers: [provideZoneChangeDetection()],
})(ZoneTestingModule);

module.exports = { ZoneTestingModule };
