import 'core-js/proposals/reflect-metadata';
import 'zone.js/dist/zone';

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule } from '../../../../../../artifacts/angular/renovation/ui/button';

import template from './app.component.html';

@Component({
  providers: [],
  selector: '#app',
  // eslint-disable-next-line spellcheck/spell-checker
  styleUrls: [],
  template,
})
export class AppComponent {}
@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
