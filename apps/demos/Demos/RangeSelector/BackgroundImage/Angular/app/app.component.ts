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
  startValue: Date = new Date(2012, 8, 29, 0, 0, 0);

  endValue: Date = new Date(2012, 8, 29, 24, 0, 0);

  startSelectedValue: Date = new Date(2012, 8, 29, 11, 0, 0);

  endSelectedValue: Date = new Date(2012, 8, 29, 17, 0, 0);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
