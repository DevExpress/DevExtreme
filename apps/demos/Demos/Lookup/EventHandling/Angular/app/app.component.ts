import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxLookupModule, DxLookupTypes } from 'devextreme-angular/ui/lookup';
import { Service, type Employee } from './app.service';

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
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly selectedEmployee = signal<Employee | undefined>(undefined);

  readonly applyValueMode = signal<DxLookupTypes.ApplyValueMode>('instantly');

  readonly applyValueModes: DxLookupTypes.ApplyValueMode[] = ['instantly', 'useButtons'];

  valueChanged({ value }: DxLookupTypes.ValueChangedEvent) {
    this.selectedEmployee.set(value);
  }

  readonly getDisplayExpr = ({ FirstName, LastName }: Record<string, string> = {}) => (FirstName ? `${FirstName} ${LastName}` : undefined);
}

bootstrapApplication(AppComponent);
