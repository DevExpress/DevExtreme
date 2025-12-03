import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
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
    DxSelectBoxModule,
    DxTextBoxModule,
    DxColorBoxModule,
    DxNumberBoxModule,
    DxSwitchModule,
  ],
})

export class AppComponent {
  color = '#f05b41';

  text = 'UI Superhero';

  _width = 370;

  _height = 260;

  transform = 'scaleX(1)';

  border = false;

  get width() {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    Promise.resolve().then(() => { this._height = value * 26 / 37; });
  }

  get height() {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    Promise.resolve().then(() => { this._width = value * 37 / 26; });
  }

  transformations = [
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

  constructor() { }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
