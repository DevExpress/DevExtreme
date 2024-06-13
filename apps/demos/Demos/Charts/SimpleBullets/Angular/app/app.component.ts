import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxBulletModule } from 'devextreme-angular';
import { Week, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})

export class AppComponent {
  weeksData: Week[];

  constructor(service: Service) {
    this.weeksData = service.getWeeksData();
  }

  customizeTooltip(arg) {
    return {
      text: `Current t&#176: ${arg.value}&#176C<br>` + `Average t&#176: ${arg.target}&#176C`,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxBulletModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
