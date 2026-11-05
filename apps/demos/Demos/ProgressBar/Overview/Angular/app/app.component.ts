import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, Pipe, type PipeTransform, enableProdMode, signal,
} from '@angular/core';
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

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxButtonModule,
    DxProgressBarModule,
    TimePipe,
  ],
})
export class AppComponent {
  readonly buttonText = signal('Start progress');

  private inProgress = false;

  readonly seconds = signal(10);

  readonly maxValue = 10;

  private intervalId: number;

  onButtonClick() {
    if (this.inProgress) {
      this.buttonText.set('Continue progress');
      clearInterval(this.intervalId);
    } else {
      this.buttonText.set('Stop progress');

      if (this.seconds() === 0) {
        this.seconds.set(10);
      }

      this.intervalId = window.setInterval(() => this.timer(), 1000);
    }
    this.inProgress = !this.inProgress;
  }

  private timer() {
    this.seconds.update((seconds) => seconds - 1);
    if (this.seconds() === 0) {
      this.buttonText.set('Restart progress');
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
    }
  }

  format(ratio: number) {
    return `Loading: ${ratio * 100}%`;
  }
}

bootstrapApplication(AppComponent);
