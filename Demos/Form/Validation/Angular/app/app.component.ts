import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxNumberBoxModule,
  DxButtonModule,
  DxFormModule,
  DxAutocompleteModule,
  DxFormComponent,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import Validator from 'devextreme/ui/validator';

import { Customer, Service } from './app.service';

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
  @ViewChild(DxFormComponent, { static: false }) form:DxFormComponent;

  passwordOptions: any = {
    mode: 'password',
    onValueChanged: () => {
      let editor = this.form.instance.getEditor('ConfirmPassword');
      if (editor.option('value')) {
        let instance = Validator.getInstance(editor.element()) as Validator;
        instance.validate();
      }
    },
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: '../../../../images/icons/eye.png',
          type: 'default',
          onClick: () => this.changePasswordMode('Password'),
        },
      },
    ],
  };

  confirmOptions: any = {
    mode: 'password',
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: '../../../../images/icons/eye.png',
          type: 'default',
          onClick: () => this.changePasswordMode('ConfirmPassword'),
        },
      },
    ],
  };

  customer: Customer;

  countries: string[];

  cities: string[];

  maxDate: Date = new Date();

  cityPattern = '^[^0-9]+$';

  namePattern: any = /^[^0-9]+$/;

  phonePattern: any = /^[02-9]\d{9}$/;

  phoneRules: any = {
    X: /[02-9]/,
  };

  buttonOptions: any = {
    text: 'Register',
    type: 'success',
    useSubmitBehavior: true,
  };

  passwordComparison = () => this.form.instance.option('formData').Password;

  checkComparison() {
    return true;
  }

  changePasswordMode = (name) => {
    let editor = this.form.instance.getEditor(name);
    editor.option(
      'mode',
      editor.option('mode') === 'text' ? 'password' : 'text',
    );
  };

  constructor(service: Service) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
    this.countries = service.getCountries();
    this.cities = service.getCities();
    this.customer = service.getCustomer();
  }

  asyncValidation(params) {
    return sendRequest(params.value);
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
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxAutocompleteModule,
    DxFormModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
