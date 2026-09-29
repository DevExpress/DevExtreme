import { ChangeDetectionStrategy, Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { DxButtonModule, DxButtonTypes } from 'devextreme-angular/ui/button';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
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
  popupVisible = false;

  popupWithScrollViewVisible = false;

  bookButtonOptions: DxButtonTypes.Properties = {
    width: 300,
    text: 'Book',
    type: 'default',
    stylingMode: 'contained',
    onClick: () => {
      this.popupVisible = false;
      this.popupWithScrollViewVisible = false;
    },
  };

  showPopup() {
    this.popupVisible = true;
  }

  showPopupWithScrollView() {
    this.popupWithScrollViewVisible = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
