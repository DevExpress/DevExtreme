import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, ViewEncapsulation,
} from '@angular/core';
import { DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule } from 'devextreme-angular';
import { DxGanttModule, type DxGanttTypes } from 'devextreme-angular/ui/gantt';
import { Service, type Task } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DxGanttModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly dependencies = this.service.getDependencies();

  readonly resources = this.service.getResources();

  readonly resourceAssignments = this.service.getResourceAssignments();

  readonly scaleType = signal<DxGanttTypes.Properties['scaleType']>('months');

  readonly titlePosition = signal<DxGanttTypes.Properties['taskTitlePosition']>('outside');

  readonly showResources = signal(true);

  readonly showDependencies = signal(true);

  readonly showCustomTaskTooltip = signal(true);

  readonly startDateRange = signal(new Date(2018, 11, 1));

  readonly endDateRange = signal(new Date(2019, 11, 1));

  getTimeEstimate(task: Task) {
    return Math.abs((task.start as unknown as number) - (task.end as unknown as number)) / 36e5;
  }

  getTimeLeft(task: Task) {
    const timeEstimate = Math.abs((task.start as unknown as number) - (task.end as unknown as number)) / 36e5;
    return Math.floor((100 - task.progress) / 100 * timeEstimate);
  }

  getTime(date: Date) {
    return date.toLocaleString();
  }
}

bootstrapApplication(AppComponent);
