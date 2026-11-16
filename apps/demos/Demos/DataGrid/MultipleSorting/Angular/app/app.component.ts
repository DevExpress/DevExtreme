import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
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
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  readonly employees = inject(Service).getEmployees();

  readonly positionDisableSorting = signal(false);

  onValueChange(e: DxCheckBoxTypes.ValueChangedEvent) {
    if (e.value) {
      this.dataGrid().instance.columnOption(5, 'sortOrder', undefined);
    }
  }
}

bootstrapApplication(AppComponent);
