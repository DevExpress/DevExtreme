import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CollaborativeEditingService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
  providers: [CollaborativeEditingService],
})
export class AppComponent {
  dataSources: Array<CustomStore>;

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
    BrowserTransferStateModule,
    DxDataGridModule,
    DxTextBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
