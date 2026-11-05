import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  readonly orders = inject(Service).getOrders();

  onStateResetClick() {
    this.dataGrid().instance.state(null);
  }

  onRefreshClick() {
    window.location.reload();
  }
}

bootstrapApplication(AppComponent);
