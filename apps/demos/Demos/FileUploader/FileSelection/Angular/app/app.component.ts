import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  ViewChild,
  enableProdMode,
  provideZoneChangeDetection
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
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
    DxTextBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  @ViewChild('form') form: NgForm;

  updateClick() {
    notify('This demo only illustrates the form upload interface. Uploading to a server is not available.');
    // form.submit();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
