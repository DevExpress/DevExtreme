import {
  NgModule, Component, Pipe, PipeTransform, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, DxProgressBarModule } from 'devextreme-angular';

@Pipe({ name: 'time' })
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
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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
    this.seconds--;
    if (this.seconds == 0) {
      this.buttonText = 'Restart progress';
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
    }
  }

  format(ratio) {
    return `Loading: ${ratio * 100}%`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxButtonModule,
    DxProgressBarModule,
  ],
  declarations: [AppComponent, TimePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
