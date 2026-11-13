import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxPaginationModule } from 'devextreme-angular';
import { Service } from './app.service';
import { EmployeeCard } from './employee-card/employee-card.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxPaginationModule,
    EmployeeCard,
  ],
})
export class AppComponent {
  private readonly employees = inject(Service).getEmployees();

  readonly itemCount = this.employees.length;

  readonly allowedPageSizes = [4, 6];

  readonly showInfo = true;

  readonly showNavigationButtons = true;

  readonly pageIndex = signal(1);

  readonly pageSize = signal(4);

  readonly pageEmployees = computed(() => this.employees.slice(
    (this.pageIndex() - 1) * this.pageSize(),
    this.pageIndex() * this.pageSize(),
  ));
}

bootstrapApplication(AppComponent);
