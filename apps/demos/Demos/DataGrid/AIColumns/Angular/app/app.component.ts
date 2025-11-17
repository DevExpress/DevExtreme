import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { Service, type Vehicle } from './app.service';
import { AiService } from './ai.service';
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
  providers: [Service, AiService],
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

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxPopupModule,
  ],
  declarations: [
    AppComponent,
    Trademark,
    Category,
    LicenseInfo,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
