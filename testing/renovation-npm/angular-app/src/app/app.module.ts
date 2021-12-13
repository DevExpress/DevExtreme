import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/* eslint-disable */
import { AppComponent } from './app.component';
import { DxButtonModule } from '@devextreme/angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule { }
