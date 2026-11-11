import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxGanttModule, type DxGanttTypes } from 'devextreme-angular/ui/gantt';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxGanttModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly dependencies = this.service.getDependencies();

  readonly resources = this.service.getResources();

  readonly resourceAssignments = this.service.getResourceAssignments();

  readonly showResources = signal(true);

  private disableContextMenu = false;

  readonly contextMenuItems = signal(this.getContextMenuItems());

  onContextMenuPreparing(e: DxGanttTypes.ContextMenuPreparingEvent) {
    e.cancel = this.disableContextMenu;
  }

  onCustomizeContextMenu(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.contextMenuItems.set(e.value ? this.getContextMenuItems() : undefined);
  }

  onPreventContextMenuShowing(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.disableContextMenu = e.value;
  }

  onCustomCommandClick(e: DxGanttTypes.CustomCommandEvent) {
    if (e.name === 'ToggleDisplayOfResources') {
      this.showResources.update((value) => !value);
    }
  }

  private getContextMenuItems() {
    return [
      'addTask',
      'taskdetails',
      'deleteTask',
      {
        name: 'ToggleDisplayOfResources',
        text: 'Toggle Display of Resources',
      },
    ];
  }
}

bootstrapApplication(AppComponent);
