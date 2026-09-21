import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DxRangeSelectorModule, DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';
import { Service, Employee } from './app.service';

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
  employees: Employee[];

  selectedEmployees: Employee[];

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.selectedEmployees = this.employees;
  }

  onValueChanged(e: DxRangeSelectorTypes.ValueChangedEvent) {
    this.selectedEmployees = this.employees.map(
      (item) => (
        (item.BirthYear >= (e.value[0] as number) && item.BirthYear <= (e.value[1] as number))
          ? item
          : undefined
      ),
    ).filter(Boolean);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
