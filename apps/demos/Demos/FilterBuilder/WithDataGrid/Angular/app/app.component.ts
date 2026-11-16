import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxFilterBuilderModule,
} from 'devextreme-angular';

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
    DxDataGridModule,
    DxButtonModule,
    DxFilterBuilderModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly fields = this.service.getFields();

  readonly columns = this.service.getColumns();

  readonly filter = signal(this.service.getFilter());

  readonly gridFilterValue = signal(this.filter());

  readonly dataSource = this.service.getProducts();

  buttonClick() {
    this.gridFilterValue.set(this.filter());
  }
}

bootstrapApplication(AppComponent);
