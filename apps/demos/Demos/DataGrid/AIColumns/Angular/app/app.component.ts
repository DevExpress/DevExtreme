import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { Service, type Vehicle } from './app.service';
import { AiService } from './ai/ai.service';
import { Trademark } from './trademark/trademark.component';
import { Category } from './category/category.component';
import { LicenseInfo } from './license-info/license-info.component';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service, AiService],
  imports: [
    DxDataGridModule,
    DxPopupModule,
    Trademark,
    Category,
    LicenseInfo
  ],
})
export class AppComponent {
  vehicles: Vehicle[];

  popupVisible = false;

  currentVehicle: Vehicle | null = null;

  aiIntegration: AIIntegration;

  constructor(service: Service, aiService: AiService) {
    this.vehicles = service.getVehicles();
    this.aiIntegration = aiService.getAiIntegration();
  }

  showInfo(vehicle: Vehicle) {
    this.currentVehicle = vehicle;
    this.popupVisible = true;
  }

  hideInfo() {
    this.popupVisible = false;
  }

  onAIColumnRequestCreating(e: { data: Partial<Vehicle>[] }) {
    e.data = e.data.map((item) => ({
      ID: item.ID,
      TrademarkName: item.TrademarkName,
      Name: item.Name,
      Modification: item.Modification,
    }));
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
