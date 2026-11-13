import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  enableProdMode,
  inject,
  viewChild,
} from '@angular/core';
import {
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxNumberBoxModule,
  DxAutocompleteModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import Validator from 'devextreme/ui/validator';
import type { AsyncRule } from 'devextreme-angular/common';
import { DxFormModule, DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import type { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import type { DxDateBoxTypes } from 'devextreme-angular/ui/date-box';
import type { DxDateRangeBoxTypes } from 'devextreme-angular/ui/date-range-box';
import { DxButtonModule, type DxButtonTypes } from 'devextreme-angular/ui/button';
import { Service } from './app.service';

type EditorOptions = DxTextBoxTypes.Properties;

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
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxAutocompleteModule,
    DxFormModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  private readonly form = viewChild.required(DxFormComponent);

  readonly customer = this.service.getCustomer();

  readonly countries = this.service.getCountries();

  readonly cities = this.service.getCities();

  readonly maxDate = getMaxDate();

  readonly cityPattern = '^[^0-9]+$';

  readonly namePattern = /^[^0-9]+$/;

  readonly phonePattern = /^[02-9]\d{9}$/;

  readonly passwordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    onValueChanged: () => {
      const editor = this.form().instance.getEditor('ConfirmPassword');
      if (editor.option('value')) {
        const instance = Validator.getInstance(editor.element()) as Validator;
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

  readonly emailEditorOptions: EditorOptions = {
    valueChangeEvent: 'keyup',
  };

  readonly nameEditorOptions: EditorOptions = {
    valueChangeEvent: 'keyup',
  };

  readonly addressEditorOptions: EditorOptions = {
    valueChangeEvent: 'keyup',
  };

  readonly phoneEditorOptions: EditorOptions = {
    mask: '(X00) 000-0000',
    maskRules: {
      X: /[02-9]/,
    },
    maskInvalidMessage: 'The phone must have a correct USA phone format',
    valueChangeEvent: 'keyup',
  };

  readonly confirmPasswordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: 'eyeopen',
          stylingMode: 'text',
          onClick: () => this.changePasswordMode('ConfirmPassword'),
        },
      },
    ],
  };

  readonly colCountByScreen: DxFormTypes.GroupItem['colCountByScreen'] = {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  };

  readonly dateBoxOptions: DxDateBoxTypes.Properties = {
    placeholder: 'Birth Date',
    acceptCustomValue: false,
    openOnFieldClick: true,
  };

  readonly dateRangeBoxOptions: DxDateRangeBoxTypes.Properties = {
    startDatePlaceholder: 'Start Date',
    endDatePlaceholder: 'End Date',
    acceptCustomValue: false,
  };

  readonly registerButtonOptions: DxButtonTypes.Properties = {
    text: 'Register',
    type: 'default',
    width: '120px',
    useSubmitBehavior: true,
  };

  readonly resetButtonOptions: DxButtonTypes.Properties = {
    text: 'Reset',
    width: '120px',
    disabled: true,
    icon: 'refresh',
    onClick: () => {
      this.form().instance.reset();
    },
  };

  readonly passwordComparison = () => this.form().instance.option('formData').Password;

  checkComparison() {
    return true;
  }

  private readonly changePasswordMode = (name: string) => {
    const editor = this.form().instance.getEditor(name);
    editor.option(
      'mode',
      editor.option('mode') === 'text' ? 'password' : 'text',
    );
  };

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

  readonly asyncValidation: AsyncRule['validationCallback'] = ({ value }) => sendRequest(value);

  readonly onFormSubmit = (e: SubmitEvent) => {
    notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);

    e.preventDefault();
  };

  readonly onOptionChanged = (e: DxFormTypes.OptionChangedEvent) => {
    if (e.name === 'isDirty') {
      const resetButton = this.form().instance.getButton('Reset');
      resetButton.option('disabled', !e.value);
    }
  };
}

bootstrapApplication(AppComponent);
