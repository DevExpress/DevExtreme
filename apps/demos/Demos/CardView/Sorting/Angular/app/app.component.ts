import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxCardViewModule } from 'devextreme-angular';
import { type House, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxCardViewModule,
  ],
})
export class AppComponent {
  readonly houses = inject(Service).getHouses();

  imageExpr({ ID }: House): string {
    return `../../../../images/houses/${ID}.jpg`;
  }

  altExpr(): string {
    return 'Photo of the house';
  }
}

bootstrapApplication(AppComponent);
