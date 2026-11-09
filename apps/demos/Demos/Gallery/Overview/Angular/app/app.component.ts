import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxGalleryModule } from 'devextreme-angular';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCheckBoxModule,
    DxGalleryModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getImages();

  readonly slideshowDelay = signal(2000);

  valueChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.slideshowDelay.set(e.value ? 2000 : 0);
  }
}

bootstrapApplication(AppComponent);
