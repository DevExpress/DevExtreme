import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
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
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly states = this.service.getStates();

  readonly employees = this.service.getEmployees();

  readonly enterKeyActions = this.service.getEnterKeyActions();

  readonly enterKeyDirections = this.service.getEnterKeyDirections();

  readonly editOnKeyPress = signal(true);

  readonly enterKeyAction = signal<DxDataGridTypes.EnterKeyAction>('moveFocus');

  readonly enterKeyDirection = signal<DxDataGridTypes.EnterKeyDirection>('column');

  onFocusedCellChanging(e: DxDataGridTypes.FocusedCellChangingEvent) {
    e.isHighlighted = true;
  }
}

bootstrapApplication(AppComponent);
