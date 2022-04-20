import {
  NgModule, Component, enableProdMode, ViewEncapsulation,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxButtonModule,
  DxRadioGroupModule,
  DxSelectBoxModule,
  DxNumberBoxModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import hideToasts from 'devextreme/ui/toast/hide_toasts';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  types: string[] = ['error', 'info', 'success', 'warning'];

  positions: string[] = [
    'top left', 'top center', 'top right',
    'bottom left', 'bottom center', 'bottom right',
    'left center', 'center', 'right center',
  ];

  directions: string[] = [
    'down', 'down-reverse', 'up', 'up-reverse',
    'left', 'left-reverse', 'right', 'right-reverse',
  ];

  id = 1;

  isAlias = true;

  aliasPosition = 'bottom center';

  coordinatePosition: object = {
    top: '',
    bottom: '',
    left: '',
    right: '',
  };

  direction = 'up';

  showNotify() {
    const position: any = this.isAlias ? this.aliasPosition : this.coordinatePosition;
    const direction: any = this.direction;

    notify({
      message: `Toast ${this.id}`,
      height: 45,
      width: 150,
      type: this.types[Math.floor(Math.random() * 4)],
      displayTime: 3500,
      animation: {
        show: {
          type: 'fade', duration: 400, from: 0, to: 1,
        },
        hide: { type: 'fade', duration: 40, to: 0 },
      },
    },
    { position, direction });
    this.id += 1;
  }

  hideAll() {
    hideToasts();
  }

  radioGroupValueChanged({ value }) {
    this.isAlias = value === 'alias';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
