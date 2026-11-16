import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxDataGridModule, DxPopupModule } from 'devextreme-angular';
import { Service, type Vehicle } from './app.service';
import { AiService } from './ai/ai.service';
import { Trademark } from './trademark/trademark.component';
import { Category } from './category/category.component';
import { LicenseInfo } from './license-info/license-info.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service, AiService],
  imports: [
    DxDataGridModule,
    DxPopupModule,
    Trademark,
    Category,
    LicenseInfo,
  ],
})
export class AppComponent {
  readonly vehicles = inject(Service).getVehicles();

  readonly aiIntegration = inject(AiService).getAiIntegration();

  readonly popupVisible = signal(false);

  readonly currentVehicle = signal<Vehicle | null>(null);

  showInfo(vehicle: Vehicle) {
    this.currentVehicle.set(vehicle);
    this.popupVisible.set(true);
  }

  hideInfo() {
    this.popupVisible.set(false);
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

bootstrapApplication(AppComponent);
