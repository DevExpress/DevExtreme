import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxButtonModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  private readonly types: string[] = ['error', 'info', 'success', 'warning'];

  readonly positions: Position[] = [
    'top left', 'top center', 'top right',
    'bottom left', 'bottom center', 'bottom right',
    'left center', 'center', 'right center',
  ];

  readonly directions: Direction[] = [
    'down-push', 'down-stack', 'up-push', 'up-stack',
    'left-push', 'left-stack', 'right-push', 'right-stack',
  ];

  private id = 1;

  readonly isPredefined = signal(true);

  readonly predefinedPosition = signal<Position>('bottom center');

  readonly top = signal<number>(undefined);

  readonly bottom = signal<number>(undefined);

  readonly left = signal<number>(undefined);

  readonly right = signal<number>(undefined);

  readonly direction = signal<Direction>('up-push');

  show() {
    const position = this.isPredefined()
      ? this.predefinedPosition()
      : {
        top: this.top(),
        bottom: this.bottom(),
        left: this.left(),
        right: this.right(),
      };
    const direction = this.direction();

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
    this.isPredefined.set(value === 'predefined');
  }
}

bootstrapApplication(AppComponent);
