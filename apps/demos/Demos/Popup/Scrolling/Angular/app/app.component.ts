import {
  Component, enableProdMode, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxPopupModule,
    DxButtonModule,
    DxScrollViewModule,
  ],
})

export class AppComponent {
  readonly popupVisible = signal(false);

  readonly popupWithScrollViewVisible = signal(false);

  readonly bookButtonOptions: DxButtonTypes.Properties = {
    width: 300,
    text: 'Book',
    type: 'default',
    stylingMode: 'contained',
    onClick: () => {
      this.popupVisible.set(false);
      this.popupWithScrollViewVisible.set(false);
    },
  };

  showPopup() {
    this.popupVisible.set(true);
  }

  showPopupWithScrollView() {
    this.popupWithScrollViewVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
