import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxTileViewModule, DxSelectBoxModule } from 'devextreme-angular';
import type { DxTileViewTypes } from 'devextreme-angular/ui/tile-view';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxTileViewModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly homes = inject(Service).getHomes();

  readonly direction = signal<DxTileViewTypes.Orientation>('horizontal');
}

bootstrapApplication(AppComponent);
