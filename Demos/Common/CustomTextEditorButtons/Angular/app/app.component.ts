import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxTextBoxModule,
  DxNumberBoxModule,
  DxDateBoxModule,
} from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})

export class AppComponent {
  passwordMode: string;

  passwordButton: any;

  currencyFormat: string;

  currencyButton: any;

  priceValue: number;

  dateValue: number;

  todayButton: any;

  prevDateButton: any;

  nextDateButton: any;

  millisecondsInDay = 24 * 60 * 60 * 1000;

  constructor() {
    this.passwordMode = 'password';
    this.passwordButton = {
      icon: '../../../../images/icons/eye.png',
      type: 'default',
      onClick: () => {
        this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
      },
    };

    this.currencyFormat = '$ #.##';
    this.priceValue = 14500.55;
    this.currencyButton = {
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

    this.dateValue = new Date().getTime();

    this.todayButton = {
      text: 'Today',
      onClick: () => {
        this.dateValue = new Date().getTime();
      },
    };

    this.prevDateButton = {
      icon: 'spinprev',
      stylingMode: 'text',
      onClick: () => {
        this.dateValue -= this.millisecondsInDay;
      },
    };

    this.nextDateButton = {
      icon: 'spinnext',
      stylingMode: 'text',
      onClick: () => {
        this.dateValue += this.millisecondsInDay;
      },
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
