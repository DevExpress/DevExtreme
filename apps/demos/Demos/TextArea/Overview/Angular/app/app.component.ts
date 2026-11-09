import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import type { DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
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
    DxTextAreaModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly valueChangeEvents = [{
    title: 'On Change',
    name: 'change',
  }, {
    title: 'On Key Up',
    name: 'keyup',
  }];

  readonly eventValue = signal(this.valueChangeEvents[0].name);

  readonly maxLength = signal<number | null>(null);

  readonly value = signal(this.service.getContent());

  readonly valueForEditableTextArea = signal(this.service.getContent());

  readonly height = signal<number | undefined>(90);

  readonly autoResizeEnabled = signal(false);

  onCheckboxValueChanged({ value }: DxCheckBoxTypes.ValueChangedEvent) {
    const str = this.service.getContent();
    this.value.set(value ? str.substring(0, 100) : str);
    this.maxLength.set(value ? 100 : null);
  }

  onAutoResizeChanged({ value }: DxCheckBoxTypes.ValueChangedEvent) {
    this.height.set(value ? undefined : 90);
  }
}

bootstrapApplication(AppComponent);
