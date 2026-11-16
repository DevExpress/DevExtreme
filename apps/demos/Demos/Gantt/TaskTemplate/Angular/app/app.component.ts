import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, ViewEncapsulation,
} from '@angular/core';
import { DxGanttModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
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
  encapsulation: ViewEncapsulation.None,
  imports: [
    DxGanttModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly dependencies = this.service.getDependencies();

  readonly resources = this.service.getResources();

  readonly resourceAssignments = this.service.getResourceAssignments();

  getImagePath(taskId) {
    const imgPath = '../../../../images/employees';
    let img = taskId < 10 ? `0${taskId}` : taskId;
    img = `${imgPath}/${img}.png`;
    return img;
  }

  getTaskColor(taskId) {
    const color = taskId % 6;
    return `custom-task-color-${color}`;
  }
}

bootstrapApplication(AppComponent);
