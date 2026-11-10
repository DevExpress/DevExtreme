import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxActionSheetModule, DxListModule } from 'devextreme-angular';
import type { DxListTypes } from 'devextreme-angular/ui/list';
import notify from 'devextreme/ui/notify';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxActionSheetModule,
    DxListModule,
  ],
})
export class AppComponent {
  readonly contacts = inject(Service).getContacts();

  readonly commands: { text: string }[] = [
    { text: 'Call' },
    { text: 'Send message' },
    { text: 'Edit' },
    { text: 'Delete' },
  ];

  readonly actionSheetVisible = signal(false);

  readonly actionSheetTarget = signal<DxListTypes.ItemClickEvent['itemElement'] | string>('');

  itemClick(e: DxListTypes.ItemClickEvent) {
    this.actionSheetTarget.set(e.itemElement);
    this.actionSheetVisible.set(true);
  }

  showNotify(text: string) {
    notify(`The "${text}" button is clicked.`);
  }
}

bootstrapApplication(AppComponent);
