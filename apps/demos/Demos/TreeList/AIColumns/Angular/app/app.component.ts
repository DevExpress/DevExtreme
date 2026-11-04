import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxTreeListModule } from 'devextreme-angular';
import { Service, type IEmployee } from './app.service';
import { AiService } from './ai/ai.service';
import { Employee } from './employee/employee.component';
import { Status } from './status/status.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service, AiService],
  imports: [
    DxTreeListModule,
    Employee,
    Status,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly aiIntegration = inject(AiService).getAiIntegration();

  onAIColumnRequestCreating(e: { data: Partial<IEmployee>[] }) {
    e.data = e.data.map((item) => ({
      ID: item.ID,
      First_Name: item.First_Name,
      Last_Name: item.Last_Name,
      Title: item.Title,
    }));
  }
}

bootstrapApplication(AppComponent);
