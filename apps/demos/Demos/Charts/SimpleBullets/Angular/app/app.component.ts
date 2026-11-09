import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxBulletModule } from 'devextreme-angular';
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
    DxBulletModule,
  ],
})

export class AppComponent {
  readonly weeksData = inject(Service).getWeeksData();

  customizeTooltip(arg) {
    return {
      text: `Current t&#176: ${arg.value}&#176C<br>Average t&#176: ${arg.target}&#176C`,
    };
  }
}

bootstrapApplication(AppComponent);
