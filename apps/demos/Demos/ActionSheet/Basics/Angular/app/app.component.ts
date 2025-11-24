import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxActionSheetModule, DxButtonModule, DxSwitchModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxActionSheetModule,
    DxButtonModule,
    DxSwitchModule,
  ],
})
export class AppComponent {
  commands: { text: string }[] = [
    { text: 'Call' },
    { text: 'Send message' },
    { text: 'Edit' },
    { text: 'Delete' },
  ];

  showNotify(text: string) {
    notify(`The "${text}" button is clicked.`);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
