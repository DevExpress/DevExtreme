import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxDateBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxDateBoxModule,
  ],
})

export class AppComponent {
  readonly value = signal(new Date(1981, 3, 27));

  readonly now = new Date();

  readonly firstWorkDay2017 = new Date(2017, 0, 3);

  readonly min = new Date(1900, 0, 1);

  readonly dateClear = new Date(2015, 11, 1, 6);

  readonly disabledDates = inject(Service).getFederalHolidays();

  readonly diffInDay = computed(() => `${Math.floor(Math.abs(((new Date()).getTime() - this.value().getTime()) / (24 * 60 * 60 * 1000)))} days`);
}

bootstrapApplication(AppComponent);
