import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxCardViewModule,
  DxProgressBarModule,
} from 'devextreme-angular';
import { Task, Service } from './app.service';
import { CardHeader } from './card-header/card-header.component';
import { PriorityComponent } from './priority/priority.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProgressComponent } from './progress-bar/progress-bar.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  standalone: false,
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  tasks: Task[];

  constructor(service: Service) {
    this.tasks = service.getTasks();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxProgressBarModule,
  ],
  declarations: [
    AppComponent,
    CardHeader,
    PriorityComponent,
    EmployeeComponent,
    ProgressComponent,
  ],
  providers: [Service],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
