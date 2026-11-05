import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxLookupModule } from 'devextreme-angular';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';

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
    DxLookupModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = new DataSource({
    store: new ArrayStore({
      data: this.service.getTasks(),
      key: 'Id',
    }),
    group: 'Assigned',
  });

  readonly employees = this.service.getEmployees();
}

bootstrapApplication(AppComponent);
