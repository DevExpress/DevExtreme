import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTextBoxModule, DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  emailValue = 'smith@corp.com';

  rules = { X: /[02-9]/ };

  valueChanged(data: DxTextBoxTypes.ValueChangedEvent) {
    this.emailValue = `${data.value.replace(/\s/g, '').toLowerCase()}@corp.com`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTextBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
