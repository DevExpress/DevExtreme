/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Button } from '@devextreme/angular/ui/button';
import { AppComponent } from './app.component';

const button = Button;
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule { }
