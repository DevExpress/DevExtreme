import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import {
  DxSelectBoxModule,
  DxTextBoxModule,
  DxColorBoxModule,
  DxNumberBoxModule,
  DxSwitchModule,
} from 'devextreme-angular';

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
    DxSelectBoxModule,
    DxTextBoxModule,
    DxColorBoxModule,
    DxNumberBoxModule,
    DxSwitchModule,
  ],
})

export class AppComponent {
  readonly color = signal('#f05b41');

  readonly text = signal('UI Superhero');

  readonly width = signal(370);

  readonly height = signal(260);

  readonly transform = signal('scaleX(1)');

  readonly border = signal(false);

  readonly transformations = [
    {
      key: 'Flip',
      items: [
        { name: '0 degrees', value: 'scaleX(1)' },
        { name: '180 degrees', value: 'scaleX(-1)' },
      ],
    },
    {
      key: 'Rotate',
      items: [
        { name: '0 degrees', value: 'rotate(0)' },
        { name: '15 degrees', value: 'rotate(15deg)' },
        { name: '30 degrees', value: 'rotate(30deg)' },
        { name: '-15 degrees', value: 'rotate(-15deg)' },
        { name: '-30 degrees', value: 'rotate(-30deg)' },
      ],
    },
  ];

  onWidthChange(value: number) {
    this.width.set(value);
    Promise.resolve().then(() => { this.height.set(value * 26 / 37); });
  }

  onHeightChange(value: number) {
    this.height.set(value);
    Promise.resolve().then(() => { this.width.set(value * 37 / 26); });
  }
}

bootstrapApplication(AppComponent);
