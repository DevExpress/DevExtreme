import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
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
  readonly dataSource = new DataSource({
    store: inject(Service).getEmployees(),
  });

  readonly filterValue: DxTreeListTypes.Properties['filterValue'] = ['City', '=', 'Bentonville'];
}

bootstrapApplication(AppComponent);
