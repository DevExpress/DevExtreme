$(() => {
  const sendRequest = function (value) {
    const invalidEmail = 'test@dx-email.com';
    const d = $.Deferred();
    setTimeout(() => {
      d.resolve(value !== invalidEmail);
    }, 1000);
    return d.promise();
  };

  const changePasswordMode = function (name) {
    const editor = formWidget.getEditor(name);
    editor.option('mode', editor.option('mode') === 'text' ? 'password' : 'text');
  };

  const formWidget = $('#form').dxForm({
    formData,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,
    validationGroup: 'customerData',
    onOptionChanged: (e) => {
      if (e.name === 'isDirty') {
        const resetButton = formWidget.getButton('Reset');
        resetButton.option('disabled', !e.value);
      }
    },
    items: [{
      itemType: 'group',
      caption: 'Credentials',
      items: [{
        dataField: 'Email',
        editorOptions: {
          valueChangeEvent: 'keyup',
        },
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
          valueChangeEvent: 'keyup',
          onValueChanged() {
            const editor = formWidget.getEditor('ConfirmPassword');
            if (editor.option('value')) {
              editor.element().dxValidator('validate');
            }
          },
          buttons: [{
            name: 'password',
            location: 'after',
            options: {
              stylingMode: 'text',
              icon: 'eyeopen',
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
        dataField: 'ConfirmPassword',
        label: {
          text: 'Confirm Password',
        },
        editorType: 'dxTextBox',
        editorOptions: {
          mode: 'password',
          valueChangeEvent: 'keyup',
          buttons: [{
            name: 'password',
            location: 'after',
            options: {
              icon: 'eyeopen',
              stylingMode: 'text',
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
            return formWidget.option('formData').Password;
          },
        }],
      }],
    }, {
      itemType: 'group',
      caption: 'Personal Data',
      items: [{
        dataField: 'Name',
        editorOptions: {
          valueChangeEvent: 'keyup',
        },
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
          placeholder: 'Birth Date',
          acceptCustomValue: false,
        },
        validationRules: [{
          type: 'required',
          message: 'Date of birth is required',
        }, {
          type: 'range',
          max: new Date().setFullYear(new Date().getFullYear() - 21),
          message: 'You must be at least 21 years old',
        }],
      }, {
        dataField: 'VacationDates',
        editorType: 'dxDateRangeBox',
        label: {
          text: 'Vacation Dates',
        },
        validationRules: [{
          type: 'custom',
          validationCallback: ({ value }) => {
            const [startDate, endDate] = value;

            if (startDate === null && endDate === null) {
              return true;
            }

            if (startDate === null || endDate === null) {
              return false;
            }

            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);

            return daysDifference <= 25;
          },
          message: 'The vacation period must not exceed 25 days',
        }],
        editorOptions: {
          startDatePlaceholder: 'Start Date',
          endDatePlaceholder: 'End Date',
          acceptCustomValue: false,
        },
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
          valueChangeEvent: 'keyup',
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
        editorOptions: {
          valueChangeEvent: 'keyup',
        },
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
          valueChangeEvent: 'keyup',
        },
        validationRules: [{
          type: 'pattern',
          pattern: /^[02-9]\d{9}$/,
          message: 'The phone must have a correct USA phone format',
        }],
      }],
    }, {
      itemType: 'group',
      cssClass: 'last-group',
      colCountByScreen: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
      },
      items: [{
        dataField: 'Accepted',
        label: {
          visible: false,
        },
        editorOptions: {
          width: 270,
          text: 'I agree to the Terms and Conditions',
        },
        validationRules: [{
          type: 'compare',
          comparisonTarget() { return true; },
          message: 'You must agree to the Terms and Conditions',
        }],
      }, {
        itemType: 'group',
        cssClass: 'buttons-group',
        colCountByScreen: {
          xs: 2,
          sm: 2,
          md: 2,
          lg: 2,
        },
        items: [{
          itemType: 'button',
          name: 'Reset',
          buttonOptions: {
            onClick: () => {
              formWidget.reset();
            },
            icon: 'refresh',
            text: 'Reset',
            disabled: true,
            width: '120px',
          },
        }, {
          itemType: 'button',
          buttonOptions: {
            text: 'Register',
            type: 'default',
            useSubmitBehavior: true,
            width: '120px',
          },
        }],
      }],
    }],
  }).dxForm('instance');

  $('#form-container').on('submit', (e) => {
    DevExpress.ui.notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);

    e.preventDefault();
  });
});
