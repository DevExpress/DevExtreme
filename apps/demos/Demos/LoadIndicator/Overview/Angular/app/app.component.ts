import { bootstrapApplication } from '@angular/platform-browser';
import {
  ChangeDetectorRef, Component, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import { DxButtonModule, DxLoadIndicatorModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxButtonModule,
    DxLoadIndicatorModule,
  ],
})
export class AppComponent {
  loadIndicatorVisible = false;

  buttonText = 'Send';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  onClick() {
    this.buttonText = 'Sending';
    this.loadIndicatorVisible = true;

    setTimeout(() => {
      this.buttonText = 'Send';
      this.loadIndicatorVisible = false;
      this.changeDetectorRef.detectChanges();
    }, 2000);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
