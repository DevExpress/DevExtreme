import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeListModule } from 'devextreme-angular';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { Service, type IEmployee } from './app.service';
import { AiService } from './ai.service';
import { Email } from './email/email.component';
import { Employee } from './employee/employee.component';
import { Status } from './status/status.component';

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
  providers: [Service, AiService],
})
export class AppComponent {
  employees: IEmployee[];

  aiIntegration: AIIntegration;

  constructor(service: Service, aiService: AiService) {
    this.employees = service.getEmployees();
    this.aiIntegration = aiService.getAiIntegration();
  }

  onAIColumnRequestCreating(e: { data: Partial<IEmployee>[] }) {
    e.data = e.data.map((item) => ({
      ID: item.ID,
      First_Name: item.First_Name,
      Last_Name: item.Last_Name,
      Title: item.Title,
    }));
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTreeListModule,
  ],
  declarations: [
    AppComponent,
    Email,
    Employee,
    Status,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
