const { NgModule, provideZonelessChangeDetection } = require('@angular/core');

const ZonelessTestingModule = NgModule({
  providers: [provideZonelessChangeDetection()],
})(class ZonelessTestingModule {});

module.exports = { ZonelessTestingModule };
