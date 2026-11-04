import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
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
    DxTreeListModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly employees = this.service.getEmployees();

  readonly enterKeyActions = this.service.getEnterKeyActions();

  readonly enterKeyDirections = this.service.getEnterKeyDirections();

  readonly editOnKeyPress = signal(true);

  readonly enterKeyAction = signal<DxTreeListTypes.EnterKeyAction>('moveFocus');

  readonly enterKeyDirection = signal<DxTreeListTypes.EnterKeyDirection>('column');

  onFocusedCellChanging(e: DxTreeListTypes.FocusedCellChangingEvent) {
    e.isHighlighted = true;
  }
}

bootstrapApplication(AppComponent);
