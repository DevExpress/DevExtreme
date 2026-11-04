import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DxCardViewComponent, DxCardViewModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { type Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxCardViewModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly cardView = viewChild.required(DxCardViewComponent);

  readonly employees = inject(Service).getEmployees();

  readonly selectionMode = signal('multiple');

  readonly allowSelectAll = signal(true);

  readonly showCheckBoxesMode = signal('always');

  readonly selectAllMode = signal('allPages');

  altExpr({ FullName }: Employee): string {
    return `Photo of ${FullName}`;
  }

  imageExpr({ FullName }: Employee): string {
    return `../../../../images/employees/new/${FullName}.jpg`;
  }

  clearSelection() {
    this.cardView().instance.clearSelection();
  }
}

bootstrapApplication(AppComponent);
