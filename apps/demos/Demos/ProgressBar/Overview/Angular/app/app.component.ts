import { bootstrapApplication } from '@angular/platform-browser';
import { Component, Pipe, PipeTransform, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonModule, DxProgressBarModule } from 'devextreme-angular';

@Pipe({ name: 'time', standalone: true })
export class TimePipe implements PipeTransform {
  transform(value: number): string {
    return `00:00:${(`0${value}`).slice(-2)}`;
  }
}

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
  imports: [
    DxButtonModule,
    DxProgressBarModule,
    TimePipe,
  ],
})
export class AppComponent {
  buttonText = 'Start progress';

  inProgress = false;

  seconds = 10;

  maxValue = 10;

  intervalId: number;

  onButtonClick() {
    if (this.inProgress) {
      this.buttonText = 'Continue progress';
      clearInterval(this.intervalId);
    } else {
      this.buttonText = 'Stop progress';

      if (this.seconds === 0) {
        this.seconds = 10;
      }

      this.intervalId = window.setInterval(() => this.timer(), 1000);
    }
    this.inProgress = !this.inProgress;
  }

  timer() {
    this.seconds -= 1;
    if (this.seconds === 0) {
      this.buttonText = 'Restart progress';
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
    }
  }

  format(ratio) {
    return `Loading: ${ratio * 100}%`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
