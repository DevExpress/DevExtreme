import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
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
  imports: [
    DxDataGridModule,
    DxTextBoxModule,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
