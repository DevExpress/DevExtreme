import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DxButtonModule } from '@devextreme/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DxButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule { }
