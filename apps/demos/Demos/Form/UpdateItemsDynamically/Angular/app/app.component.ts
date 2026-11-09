import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import type { DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import type { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
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
    DxFormModule,
  ],
})

export class AppComponent {
  readonly employee = inject(Service).getEmployee();

  readonly isHomeAddressVisible = signal(true);

  readonly phoneOptions = signal<DxTextBoxTypes.Properties[]>(this.getPhonesOptions(this.employee.Phones));

  readonly checkBoxOptions: DxCheckBoxTypes.Properties = {
    text: 'Show Address',
    value: true,
    onValueChanged: (e: DxCheckBoxTypes.ValueChangedEvent) => {
      this.isHomeAddressVisible.set(e.component.option('value'));
    },
  };

  readonly addPhoneButtonOptions: DxButtonTypes.Properties = {
    icon: 'add',
    text: 'Add phone',
    onClick: () => {
      this.employee.Phones.push('');
      this.phoneOptions.set(this.getPhonesOptions(this.employee.Phones));
    },
  };

  private getPhonesOptions(phones: string[]) {
    return phones.map((_, index) => this.generateNewPhoneOptions(index));
  }

  private generateNewPhoneOptions(index: number): DxTextBoxTypes.Properties {
    return {
      mask: '(X00) 000-0000',
      maskRules: { X: /[01-9]/ },
      buttons: [{
        name: 'trash',
        location: 'after',
        options: {
          stylingMode: 'text',
          icon: 'trash',
          onClick: () => {
            this.employee.Phones.splice(index, 1);
            this.phoneOptions.set(this.getPhonesOptions(this.employee.Phones));
          },
        },
      }],
    };
  }
}

bootstrapApplication(AppComponent);
