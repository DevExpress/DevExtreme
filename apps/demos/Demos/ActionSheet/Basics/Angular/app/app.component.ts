import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxActionSheetModule, DxButtonModule, DxSwitchModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
