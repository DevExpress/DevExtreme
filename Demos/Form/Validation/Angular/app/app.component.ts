import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
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

  passwordEditorOptions: any = {
    mode: 'password',
    valueChangeEvent: 'keyup',
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
          stylingMode: 'text',
          icon: 'eyeopen',
          onClick: () => this.changePasswordMode('Password'),
        },
      },
    ],
  };

  emailEditorOptions: any = {
    valueChangeEvent: 'keyup',
  };

  nameEditorOptions: any = {
    valueChangeEvent: 'keyup',
  };

  addressEditorOptions: any = {
    valueChangeEvent: 'keyup',
  };

  phoneEditorOptions: any = {
    mask: '+1 (X00) 000-0000',
    maskRules: {
      X: /[02-9]/,
    },
    maskInvalidMessage: 'The phone must have a correct USA phone format',
    valueChangeEvent: 'keyup',
  };

  confirmPasswordEditorOptions: any = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    buttons: [
      {
        name: 'password',
        stylingMode: 'text',
        icon: 'eyeopen',
        location: 'after',
        options: {
          stylingMode: 'text',
          icon: 'eyeopen',
          onClick: () => this.changePasswordMode('ConfirmPassword'),
        },
      },
    ],
  };

  colCountByScreen = {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  };

  customer: Customer;

  countries: string[];

  cities: string[];

  maxDate: Date = new Date();

  cityPattern = '^[^0-9]+$';

  namePattern: any = /^[^0-9]+$/;

  phonePattern: any = /^[02-9]\d{9}$/;

  dateBoxOptions = {
    placeholder: 'Birth Date',
    acceptCustomValue: false,
  };

  dateRangeBoxOptions = {
    startDatePlaceholder: 'Start Date',
    endDatePlaceholder: 'End Date',
    acceptCustomValue: false,
  };

  registerButtonOptions = {
    text: 'Register',
    type: 'default',
    width: '120px',
    useSubmitBehavior: true,
  };

  resetButtonOptions = {
    text: 'Reset',
    width: '120px',
    disabled: true,
    icon: 'refresh',
    onClick: () => {
      this.form.instance.reset();
    },
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

  validateVacationDatesRange({ value }) {
    const [startDate, endDate] = value;

    if (startDate === null || endDate === null) {
      return true;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);

    return daysDifference < 25;
  }

  validateVacationDatesPresence({ value }) {
    const [startDate, endDate] = value;

    if (startDate === null && endDate === null) {
      return true;
    }

    return startDate !== null && endDate !== null;
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

  onOptionChanged = function (e) {
    if (e.name === 'isDirty') {
      const resetButton = this.form.instance.getButton('Reset');
      resetButton.option('disabled', !e.value);
    }
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
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
