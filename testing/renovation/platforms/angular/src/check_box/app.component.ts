import 'core-js/proposals/reflect-metadata';
import 'zone.js/dist/zone';

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule } from '../../../../../../artifacts/angular/renovation/ui/editors/check_box/check_box';

@Component({
  providers: [],
  selector: '#app',
  // eslint-disable-next-line spellcheck/spell-checker
  styleUrls: [],
})
export class AppComponent {}
@NgModule({
  imports: [
    BrowserModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
