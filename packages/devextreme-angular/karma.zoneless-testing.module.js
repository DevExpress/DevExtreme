const { NgModule, provideZonelessChangeDetection } = require('@angular/core');

class ZonelessTestingModule {}

NgModule({
  providers: [provideZonelessChangeDetection()],
})(ZonelessTestingModule);

module.exports = { ZonelessTestingModule };
