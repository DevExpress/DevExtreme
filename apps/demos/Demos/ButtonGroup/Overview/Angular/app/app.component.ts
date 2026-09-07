import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonGroupModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

import { Alignment, FontStyle, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxButtonGroupModule,
  ],
})

export class AppComponent {
  alignments: Alignment[];

  fontStyles: FontStyle[];

  constructor(service: Service) {
    this.alignments = service.getAlignments();
    this.fontStyles = service.getFontStyles();
  }

  itemClick(e) {
    notify({ message: `The "${e.itemData.hint}" button was clicked`, width: 320 }, 'success', 1000);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
