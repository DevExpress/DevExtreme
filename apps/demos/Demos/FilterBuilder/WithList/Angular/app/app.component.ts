import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  DxListModule,
  DxButtonModule,
  DxTagBoxModule,
  DxFilterBuilderComponent,
  DxFilterBuilderModule,
} from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import { type Filter, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxListModule,
    DxButtonModule,
    DxTagBoxModule,
    DxFilterBuilderModule,
    CurrencyPipe,
  ],
})

export class AppComponent {
  private readonly filterBuilder = viewChild.required(DxFilterBuilderComponent);

  private readonly service = inject(Service);

  readonly fields = this.service.getFields();

  readonly filter = signal<Filter>(this.service.getFilter());

  readonly dataSource = new DataSource({
    store: this.service.getProducts(),
  });

  refreshDataSource() {
    this.dataSource.filter(this.filterBuilder().instance.getFilterExpression());
    this.dataSource.load();
  }
}

bootstrapApplication(AppComponent);
