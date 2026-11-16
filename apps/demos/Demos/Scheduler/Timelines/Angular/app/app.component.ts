import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSchedulerModule, DxSelectBoxModule } from 'devextreme-angular';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxSchedulerModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly resourcesData = this.service.getResources();

  readonly prioritiesData = this.service.getPriorities();

  readonly currentDate = new Date(2021, 1, 2);

  readonly snapToCellsMode = signal<DxSchedulerTypes.SnapToCellsMode>('always');

  readonly snapToCellsModeItems: DxSchedulerTypes.SnapToCellsMode[] = ['auto', 'always', 'never'];

  onSnapToCellsModeChanged(e: DxSelectBoxTypes.ValueChangedEvent): void {
    this.snapToCellsMode.set(e.value);
  }
}

bootstrapApplication(AppComponent);
