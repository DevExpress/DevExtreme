import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { CustomStore } from 'devextreme-angular/common/data';
import { CollaborativeEditingService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
  providers: [CollaborativeEditingService],
})
export class AppComponent {
  dataSources: CustomStore[];

  stateDataSource: CustomStore;

  maxDate: Date = new Date(3000, 0);

  constructor(private service: CollaborativeEditingService) {
    this.dataSources = [this.service.createStore(), this.service.createStore()];
    this.stateDataSource = this.service.createStatesStore();

    this.service.getStoreChangedObservable().subscribe((events) => {
      this.dataSources.forEach((store) => store.push(events));
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxTextBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
