import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DxRangeSelectorModule, type DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';
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
    DxRangeSelectorModule,
    DxDataGridModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly selectedEmployees = signal(this.employees);

  onValueChanged(e: DxRangeSelectorTypes.ValueChangedEvent) {
    this.selectedEmployees.set(this.employees.map(
      (item) => (
        (item.BirthYear >= (e.value[0] as number) && item.BirthYear <= (e.value[1] as number))
          ? item
          : undefined
      ),
    ).filter(Boolean));
  }
}

bootstrapApplication(AppComponent);
