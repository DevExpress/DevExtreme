import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxButtonModule,
  ],
})

export class AppComponent {
  weatherClick() {
    notify('The Weather button was clicked');
  }

  doneClick() {
    notify('The Done button was clicked');
  }

  sendClick() {
    notify('The Send button was clicked');
  }

  plusClick() {
    notify('The button was clicked');
  }

  backClick() {
    notify('The button was clicked');
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
