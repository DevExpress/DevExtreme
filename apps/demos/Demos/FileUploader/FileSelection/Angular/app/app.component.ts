import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, viewChild } from '@angular/core';
import type { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTextBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  readonly form = viewChild<NgForm>('form');

  updateClick() {
    notify('This demo only illustrates the form upload interface. Uploading to a server is not available.');
    // form.submit();
  }
}

bootstrapApplication(AppComponent);
