import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxTextBoxModule,
  DxDateBoxModule,
  DxDateRangeBoxModule,
  DxButtonModule,
  DxValidatorModule,
  DxValidatorComponent,
  DxValidationSummaryModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import type { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import type { ValidationCallbackData } from 'devextreme-angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const sendRequest = function (value: string) {
  const invalidEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value !== invalidEmail);
    }, 1000);
  });
};

const getMaxDate = () => {
  const date = new Date();
  return new Date(date.setFullYear(date.getFullYear() - 21));
};

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxDateRangeBoxModule,
    DxButtonModule,
    DxValidatorModule,
    DxValidationSummaryModule,
  ],
})

export class AppComponent {
  private readonly validator = viewChild.required<DxValidatorComponent>('targetValidator');

  password = '';

  confirmPassword = '';

  readonly passwordMode = signal<DxTextBoxTypes.TextBoxType>('password');

  readonly confirmPasswordMode = signal<DxTextBoxTypes.TextBoxType>('password');

  readonly maxDate = getMaxDate();

  readonly cityPattern = '^[^0-9]+$';

  readonly namePattern = /^[^0-9]+$/;

  readonly phonePattern = /^[02-9]\d{9}$/;

  readonly countries = inject(Service).getCountries();

  readonly phoneRules: DxTextBoxTypes.Properties['maskRules'] = {
    X: /[02-9]/,
  };

  readonly passwordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.passwordMode.update((mode) => (mode === 'text' ? 'password' : 'text'));
    },
  };

  readonly confirmPasswordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.confirmPasswordMode.update((mode) => (mode === 'text' ? 'password' : 'text'));
    },
  };

  readonly passwordComparison = () => this.password;

  readonly checkComparison = () => true;

  validateVacationDatesRange({ value: [startDate, endDate] }: ValidationCallbackData) {
    if (startDate === null || endDate === null) {
      return true;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);

    return daysDifference < 25;
  }

  validateVacationDatesPresence({ value: [startDate, endDate] }: ValidationCallbackData) {
    if (startDate === null && endDate === null) {
      return true;
    }

    return startDate !== null && endDate !== null;
  }

  readonly asyncValidation = (params: ValidationCallbackData) => sendRequest(params.value);

  onPasswordChanged() {
    if (this.confirmPassword) {
      this.validator().instance.validate();
    }
  }

  readonly onFormSubmit = function (e: SubmitEvent) {
    notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);

    e.preventDefault();
  };
}

bootstrapApplication(AppComponent);
