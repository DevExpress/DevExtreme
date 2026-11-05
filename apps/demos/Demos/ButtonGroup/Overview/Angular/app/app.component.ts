import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxButtonGroupModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

import { Service } from './app.service';

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
  private readonly service = inject(Service);

  readonly alignments = this.service.getAlignments();

  readonly fontStyles = this.service.getFontStyles();

  itemClick(e) {
    notify({ message: `The "${e.itemData.hint}" button was clicked`, width: 320 }, 'success', 1000);
  }
}

bootstrapApplication(AppComponent);
