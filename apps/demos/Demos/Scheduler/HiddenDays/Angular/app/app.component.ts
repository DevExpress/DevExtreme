import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSchedulerModule, type DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { ArrayStore } from 'devextreme-angular/common/data';
import { DataService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

interface DayLabel {
  index: DxSchedulerTypes.DayOfWeek;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService],
  imports: [
    DxSchedulerModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly dataSource = new ArrayStore({
    key: 'id',
    data: inject(DataService).getAppointments(),
  });

  readonly currentDate = new Date(2021, 3, 26);

  readonly validationMessage = 'The hiddenWeekDays option cannot hide all days of the week. At least one day must remain visible.';

  readonly dayLabels = signal<DayLabel[]>([
    { index: 0, label: 'Sunday', visible: true },
    { index: 1, label: 'Monday', visible: true },
    { index: 2, label: 'Tuesday', visible: true },
    { index: 3, label: 'Wednesday', visible: false },
    { index: 4, label: 'Thursday', visible: true },
    { index: 5, label: 'Friday', visible: false },
    { index: 6, label: 'Saturday', visible: true },
  ]);

  readonly hiddenWeekDays = computed(() => this.dayLabels()
    .filter((d) => !d.visible)
    .map((d) => d.index));

  readonly isInvalid = computed(() => this.dayLabels().every((d) => !d.visible));

  onDayToggled(e: DxCheckBoxTypes.ValueChangedEvent, dayIndex: number): void {
    this.dayLabels.update((labels) => labels.map((d) => (
      d.index === dayIndex ? { ...d, visible: e.value } : d
    )));
  }
}

bootstrapApplication(AppComponent);
