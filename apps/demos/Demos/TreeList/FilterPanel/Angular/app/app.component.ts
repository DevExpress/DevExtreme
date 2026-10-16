import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTreeListModule,
  ],
})

export class AppComponent {
  dataSource: DataSource;

  filterValue: DxTreeListTypes.Properties['filterValue'] = ['City', '=', 'Bentonville'];

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: service.getEmployees(),
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
