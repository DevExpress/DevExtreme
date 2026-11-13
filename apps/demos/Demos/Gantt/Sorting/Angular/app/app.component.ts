import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxGanttModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import type { SingleOrMultiple } from 'devextreme-angular/common';
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
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly dependencies = this.service.getDependencies();

  readonly resources = this.service.getResources();

  readonly resourceAssignments = this.service.getResourceAssignments();

  readonly showSortIndexes = signal(false);

  readonly sortingMode = signal<SingleOrMultiple>('single');

  readonly showSortIndexDisabled = computed(() => this.sortingMode() !== 'multiple');
}

bootstrapApplication(AppComponent);
