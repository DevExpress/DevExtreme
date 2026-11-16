import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, Component, signal } from '@angular/core';
import { DxNumberBoxModule, DxDateBoxModule } from 'devextreme-angular';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxTextBoxModule, type DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxTextBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule,
  ],
})

export class AppComponent {
  private readonly millisecondsInDay = 24 * 60 * 60 * 1000;

  readonly currencyFormat = signal('$ #.##');

  private priceValue = 14500.55;

  readonly passwordMode = signal<DxTextBoxTypes.TextBoxType>('password');

  readonly dateValue = signal(new Date().getTime());

  readonly passwordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.passwordMode.update((mode) => (mode === 'text' ? 'password' : 'text'));
    },
  };

  readonly currencyButton: DxButtonTypes.Properties = {
    text: '€',
    stylingMode: 'text',
    width: 32,
    elementAttr: {
      class: 'currency',
    },
    onClick: (e) => {
      if (e.component.option('text') === '$') {
        e.component.option('text', '€');
        this.currencyFormat.set('$ #.##');
        this.priceValue /= 0.836;
      } else {
        e.component.option('text', '$');
        this.currencyFormat.set('€ #.##');
        this.priceValue *= 0.836;
      }
    },
  };

  readonly todayButton: DxButtonTypes.Properties = {
    text: 'Today',
    stylingMode: 'text',
    onClick: () => {
      this.dateValue.set(new Date().getTime());
    },
  };

  readonly prevDateButton: DxButtonTypes.Properties = {
    icon: 'spinprev',
    stylingMode: 'text',
    onClick: () => {
      this.dateValue.update((value) => value - this.millisecondsInDay);
    },
  };

  readonly nextDateButton: DxButtonTypes.Properties = {
    icon: 'spinnext',
    stylingMode: 'text',
    onClick: () => {
      this.dateValue.update((value) => value + this.millisecondsInDay);
    },
  };
}

bootstrapApplication(AppComponent);
