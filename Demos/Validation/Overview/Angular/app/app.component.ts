import {
  Component, NgModule, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxTextBoxModule,
  DxDateBoxModule,
  DxButtonModule,
  DxValidatorModule,
  DxValidatorComponent,
  DxValidationSummaryModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const sendRequest = function (value) {
  const invalidEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value !== invalidEmail);
    }, 1000);
  });
};

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  @ViewChild('targetValidator', { static: false }) validator: DxValidatorComponent;

  password = '';

  confirmPassword = '';

  passwordMode = 'password';

  confirmPasswordMode = 'password';

  maxDate: Date = new Date();

  cityPattern = '^[^0-9]+$';

  namePattern: any = /^[^0-9]+$/;

  phonePattern: any = /^[02-9]\d{9}$/;

  countries: string[];

  phoneRules: any = {
    X: /[02-9]/,
  };

  passwordButton: any = {
    icon: '../../../../images/icons/eye.png',
    type: 'default',
    onClick: () => {
      this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
    },
  };

  confirmPasswordButton: any = {
    icon: '../../../../images/icons/eye.png',
    type: 'default',
    onClick: () => {
      this.confirmPasswordMode = this.confirmPasswordMode === 'text' ? 'password' : 'text';
    },
  };

  constructor(service: Service) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
    this.countries = service.getCountries();
  }

  passwordComparison = () => this.password;

  checkComparison() {
    return true;
  }

  asyncValidation(params) {
    return sendRequest(params.value);
  }

  onPasswordChanged() {
    if (this.confirmPassword) {
      this.validator.instance.validate();
    }
  }

  onFormSubmit = function (e) {
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

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidatorModule,
    DxValidationSummaryModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
