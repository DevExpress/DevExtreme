import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { Service, EuropeanUnion } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  dataSource: EuropeanUnion[];

  placeholder = 'Search...';

  rtlEnabled = false;

  languages: string[] = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];

  constructor(service: Service) {
    this.dataSource = service.getEuropeanUnion();
  }

  onSelectLanguage(data) {
    this.rtlEnabled = data.value === this.languages[0];
    this.placeholder = this.rtlEnabled ? 'بحث' : 'Search...';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
