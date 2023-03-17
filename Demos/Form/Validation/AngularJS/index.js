const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let formInstance;

  const sendRequest = function (value) {
    const invalidEmail = 'test@dx-email.com';
    const d = $.Deferred();
    setTimeout(() => {
      d.resolve(value !== invalidEmail);
    }, 1000);
    return d.promise();
  };

  const changePasswordMode = function (name) {
    const editor = formInstance.getEditor(name);
    editor.option('mode', editor.option('mode') === 'text' ? 'password' : 'text');
  };

  $scope.formOptions = {
    formData,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,
    validationGroup: 'customerData',
    onInitialized(e) {
      formInstance = e.component;
    },
    items: [{
      itemType: 'group',
      caption: 'Credentials',
      items: [{
        dataField: 'Email',
        validationRules: [{
          type: 'required',
          message: 'Email is required',
        }, {
          type: 'email',
          message: 'Email is invalid',
        }, {
          type: 'async',
          message: 'Email is already registered',
          validationCallback(params) {
            return sendRequest(params.value);
          },
        }],
      }, {
        dataField: 'Password',
        editorOptions: {
          mode: 'password',
          onValueChanged() {
            const editor = formInstance.getEditor('ConfirmPassword');
            if (editor.option('value')) {
              editor.element().dxValidator('validate');
            }
          },
          buttons: [{
            name: 'password',
            location: 'after',
            options: {
              icon: '../../../../images/icons/eye.png',
              type: 'default',
              onClick: () => changePasswordMode('Password'),
            },
          }],
        },
        validationRules: [{
          type: 'required',
          message: 'Password is required',
        }],
      }, {
        name: 'ConfirmPassword',
        label: {
          text: 'Confirm Password',
        },
        editorType: 'dxTextBox',
        editorOptions: {
          mode: 'password',
          buttons: [{
            name: 'password',
            location: 'after',
            options: {
              icon: '../../../../images/icons/eye.png',
              type: 'default',
              onClick: () => changePasswordMode('ConfirmPassword'),
            },
          }],
        },
        validationRules: [{
          type: 'required',
          message: 'Confirm Password is required',
        }, {
          type: 'compare',
          message: "'Password' and 'Confirm Password' do not match",
          comparisonTarget() {
            return formInstance.option('formData').Password;
          },
        }],
      }],
    }, {
      itemType: 'group',
      caption: 'Personal Data',
      items: [{
        dataField: 'Name',
        validationRules: [{
          type: 'required',
          message: 'Name is required',
        }, {
          type: 'pattern',
          pattern: '^[^0-9]+$',
          message: 'Do not use digits in the Name',
        }],

      }, {
        dataField: 'Date',
        editorType: 'dxDateBox',
        label: {
          text: 'Date of birth',
        },
        editorOptions: {
          invalidDateMessage: 'The date must have the following format: MM/dd/yyyy',
        },
        validationRules: [{
          type: 'required',
          message: 'Date of birth is required',
        }, {
          type: 'range',
          max: new Date().setFullYear(new Date().getFullYear() - 21),
          message: 'You must be at least 21 years old',
        }],
      }],
    }, {
      itemType: 'group',
      caption: 'Billing address',
      items: [{
        dataField: 'Country',
        editorType: 'dxSelectBox',
        editorOptions: {
          dataSource: countries,
        },
        validationRules: [{
          type: 'required',
          message: 'Country is required',
        }],
      }, {
        dataField: 'City',
        editorType: 'dxAutocomplete',
        editorOptions: {
          dataSource: cities,
          minSearchLength: 2,
        },
        validationRules: [{
          type: 'pattern',
          pattern: '^[^0-9]+$',
          message: 'Do not use digits in the City name',
        }, {
          type: 'stringLength',
          min: 2,
          message: 'City must have at least 2 symbols',
        }, {
          type: 'required',
          message: 'City is required',
        }],
      }, {
        dataField: 'Address',
        validationRules: [{
          type: 'required',
          message: 'Address is required',
        }],
      }, {
        dataField: 'Phone',
        helpText: 'Enter the phone number in USA phone format',
        editorOptions: {
          mask: '+1 (X00) 000-0000',
          maskRules: {
            X: /[02-9]/,
          },
          maskInvalidMessage: 'The phone must have a correct USA phone format',
        },
        validationRules: [{
          type: 'pattern',
          pattern: /^[02-9]\d{9}$/,
          message: 'The phone must have a correct USA phone format',
        }],
      }, {
        dataField: 'Accepted',
        label: {
          visible: false,
        },
        editorOptions: {
          text: 'I agree to the Terms and Conditions',
        },
        validationRules: [{
          type: 'compare',
          comparisonTarget() { return true; },
          message: 'You must agree to the Terms and Conditions',
        }],
      }],
    }, {
      itemType: 'button',
      horizontalAlignment: 'left',
      buttonOptions: {
        text: 'Register',
        type: 'success',
        useSubmitBehavior: true,
      },
    }],
  };

  $scope.onFormSubmit = function (e) {
    DevExpress.ui.notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);

    e.preventDefault();
  };
});
