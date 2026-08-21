import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxBarGaugeModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxBarGaugeModule,
  ],
})

export class AppComponent {
  getText(item, text) {
    return `Racer ${item.index + 1} - ${text} km/h`;
  }

  customizeTooltip = (arg) => ({
    text: this.getText(arg, arg.valueText),
  });

  customizeText = (arg) => this.getText(arg.item, arg.text);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
