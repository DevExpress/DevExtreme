import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';
import { DxDiagramModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  dataSource: ArrayStore;

  constructor(service: Service) {
    this.dataSource = new ArrayStore({
      key: 'ID',
      data: service.getEmployees(),
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
