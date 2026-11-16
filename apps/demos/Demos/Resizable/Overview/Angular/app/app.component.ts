import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, ViewEncapsulation,
} from '@angular/core';
import {
  DxResizableModule,
  DxDataGridModule,
  DxTagBoxModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import type { DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  encapsulation: ViewEncapsulation.None,
  imports: [
    DxResizableModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxTagBoxModule,
  ],
})
export class AppComponent {
  readonly handleValues: string[] = ['left', 'top', 'right', 'bottom'];

  readonly keepAspectRatio = signal(true);

  readonly handles = signal<string[]>(['left', 'top', 'right', 'bottom']);

  readonly orders = inject(Service).getOrders();

  readonly resizableClasses = signal('');

  handlesValueChange({ value }: DxTagBoxTypes.ValueChangedEvent) {
    this.resizableClasses.set(this.handleValues.reduce((acc, handle) => {
      const newClass = value.includes(handle) ? '' : ` no-${handle}-handle`;
      return acc + newClass;
    }, 'dx-resizable'));
  }
}

bootstrapApplication(AppComponent);
