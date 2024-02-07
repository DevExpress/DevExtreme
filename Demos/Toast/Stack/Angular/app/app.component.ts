import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
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

type Position = Parameters<typeof notify>[1]['position'];
type Direction = Parameters<typeof notify>[1]['direction'];

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  types: string[] = ['error', 'info', 'success', 'warning'];

  positions: Position[] = [
    'top left', 'top center', 'top right',
    'bottom left', 'bottom center', 'bottom right',
    'left center', 'center', 'right center',
  ];

  directions: Direction[] = [
    'down-push', 'down-stack', 'up-push', 'up-stack',
    'left-push', 'left-stack', 'right-push', 'right-stack',
  ];

  id = 1;

  isPredefined = true;

  predefinedPosition: Position = 'bottom center';

  coordinatePosition: Position = {
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
  };

  direction: Direction = 'up-push';

  show() {
    const position = this.isPredefined ? this.predefinedPosition : this.coordinatePosition;
    const direction = this.direction;

    notify({
      message: `Toast ${this.id}`,
      height: 45,
      width: 150,
      minWidth: 150,
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
    this.isPredefined = value === 'predefined';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
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
