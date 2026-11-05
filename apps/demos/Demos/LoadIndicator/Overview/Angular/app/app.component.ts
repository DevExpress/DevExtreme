import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, signal,
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
  readonly loadIndicatorVisible = signal(false);

  readonly buttonText = computed(() => (this.loadIndicatorVisible() ? 'Sending' : 'Send'));

  onClick() {
    this.loadIndicatorVisible.set(true);

    setTimeout(() => {
      this.loadIndicatorVisible.set(false);
    }, 2000);
  }
}

bootstrapApplication(AppComponent);
