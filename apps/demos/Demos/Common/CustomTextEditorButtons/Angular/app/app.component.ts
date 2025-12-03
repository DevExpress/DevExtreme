import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, Component, provideZoneChangeDetection } from '@angular/core';
import { DxNumberBoxModule, DxDateBoxModule } from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxTextBoxModule, DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

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
  providers: [],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
  imports: [
    DxTextBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule,
  ],
})

export class AppComponent {
  millisecondsInDay = 24 * 60 * 60 * 1000;

  currencyFormat = '$ #.##';

  priceValue = 14500.55;

  passwordMode: DxTextBoxTypes.TextBoxType = 'password';

  dateValue = new Date().getTime();

  passwordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
    },
  };

  currencyButton: DxButtonTypes.Properties = {
    text: '€',
    stylingMode: 'text',
    width: 32,
    elementAttr: {
      class: 'currency',
    },
    onClick: (e) => {
      if (e.component.option('text') === '$') {
        e.component.option('text', '€');
        this.currencyFormat = '$ #.##';
        this.priceValue /= 0.836;
      } else {
        e.component.option('text', '$');
        this.currencyFormat = '€ #.##';
        this.priceValue *= 0.836;
      }
    },
  };

  todayButton: DxButtonTypes.Properties = {
    text: 'Today',
    stylingMode: 'text',
    onClick: () => {
      this.dateValue = new Date().getTime();
    },
  };

  prevDateButton: DxButtonTypes.Properties = {
    icon: 'spinprev',
    stylingMode: 'text',
    onClick: () => {
      this.dateValue -= this.millisecondsInDay;
    },
  };

  nextDateButton: DxButtonTypes.Properties = {
    icon: 'spinnext',
    stylingMode: 'text',
    onClick: () => {
      this.dateValue += this.millisecondsInDay;
    },
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
