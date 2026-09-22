import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { DevExtremeModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DevExtremeModule,
  ],
  providers: [
    provideZoneChangeDetection(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
