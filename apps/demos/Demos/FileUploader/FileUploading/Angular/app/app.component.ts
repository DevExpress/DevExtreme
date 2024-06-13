import {
  NgModule, Component, enableProdMode, Pipe, PipeTransform,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule,
} from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Pipe({ name: 'demodate' })
export class DemoDatePipe<TArgs, TReturn> implements PipeTransform {
  transform(date: number) {
    return new Date(date);
  }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  value: File[] = [];
}

@NgModule({
  imports: [
    BrowserModule,
    DxCheckBoxModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent, DemoDatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
