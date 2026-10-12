import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  startValue: Date = new Date(2011, 1, 1);

  endValue: Date = new Date(2011, 6, 1);

  selectedStartValue: Date = new Date(2011, 1, 5);

  selectedEndValue: Date = new Date(2011, 2, 5);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
