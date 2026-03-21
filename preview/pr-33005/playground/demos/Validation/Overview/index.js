$(() => {
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() - 21);

  const sendRequest = function (value) {
    const invalidEmail = 'test@dx-email.com';
    const d = $.Deferred();
    setTimeout(() => {
      d.resolve(value !== invalidEmail);
    }, 1000);
    return d.promise();
  };

  const changePasswordMode = function (name) {
    const editor = $(name).dxTextBox('instance');
    editor.option('mode', editor.option('mode') === 'text' ? 'password' : 'text');
  };

  $('#summary').dxValidationSummary({ });

  $('#email-validation').dxTextBox({
    inputAttr: { 'aria-label': 'Email' },
  })
    .dxValidator({
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
    });

  $('#password-validation').dxTextBox({
    mode: 'password',
    inputAttr: { 'aria-label': 'Password' },
    onValueChanged() {
      const editor = $('#confirm-password-validation').dxTextBox('instance');
      if (editor.option('value')) {
        $('#confirm-password-validation').dxValidator('validate');
      }
    },
    buttons: [{
      name: 'password',
      location: 'after',
      options: {
        icon: 'eyeopen',
        stylingMode: 'text',
        onClick: () => changePasswordMode('#password-validation'),
      },
    }],
  }).dxValidator({
    validationRules: [{
      type: 'required',
      message: 'Password is required',
    }],
  });

  $('#confirm-password-validation').dxTextBox({
    mode: 'password',
    inputAttr: { 'aria-label': 'Password' },
    buttons: [{
      name: 'password',
      location: 'after',
      options: {
        icon: 'eyeopen',
        stylingMode: 'text',
        onClick: () => changePasswordMode('#confirm-password-validation'),
      },
    }],
  }).dxValidator({
    validationRules: [{
      type: 'compare',
      comparisonTarget() {
        const password = $('#password-validation').dxTextBox('instance');
        if (password) {
          return password.option('value');
        }
        return null;
      },
      message: "'Password' and 'Confirm Password' do not match.",
    },
    {
      type: 'required',
      message: 'Confirm Password is required',
    }],
  });

  $('#name-validation').dxTextBox({
    value: 'Peter',
    inputAttr: { 'aria-label': 'Name' },
  }).dxValidator({
    validationRules: [{
      type: 'required',
      message: 'Name is required',
    }, {
      type: 'pattern',
      pattern: /^[^0-9]+$/,
      message: 'Do not use digits in the Name.',
    }, {
      type: 'stringLength',
      min: 2,
      message: 'Name must have at least 2 symbols',
    }],
  });

  $('#date-validation').dxDateBox({
    invalidDateMessage: 'The date must have the following format: MM/dd/yyyy',
    inputAttr: { 'aria-label': 'Date' },
  }).dxValidator({
    validationRules: [{
      type: 'required',
      message: 'Date of birth is required',
    }, {
      type: 'range',
      max: maxDate,
      message: 'You must be at least 21 years old',
    }],
  });

  $('#vacation-validation').dxDateRangeBox({
    inputAttr: { 'aria-label': 'Vacation Dates' },
  }).dxValidator({
    validationRules: [{
      type: 'custom',
      validationCallback: ({ value }) => {
        const [startDate, endDate] = value;

        if (startDate === null || endDate === null) {
          return true;
        }

        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);

        return daysDifference < 25;
      },
      message: 'The vacation period must not exceed 25 days',
    }, {
      type: 'custom',
      validationCallback: ({ value }) => {
        const [startDate, endDate] = value;

        if (startDate === null && endDate === null) {
          return true;
        }

        return startDate !== null && endDate !== null;
      },
      message: 'Both start and end dates must be selected',
    }],
  });

  $('#country-validation').dxSelectBox({
    dataSource: countries,
    inputAttr: { 'aria-label': 'Country' },
    validationMessagePosition: 'left',
  }).dxValidator({
    validationRules: [{
      type: 'required',
      message: 'Country is required',
    }],
  });

  $('#city-validation').dxTextBox({
    validationMessagePosition: 'left',
    inputAttr: { 'aria-label': 'City' },
  })
    .dxValidator({
      validationRules: [{
        type: 'required',
        message: 'City is required',
      }, {
        type: 'pattern',
        pattern: '^[^0-9]+$',
        message: 'Do not use digits in the City name.',
      }, {
        type: 'stringLength',
        min: 2,
        message: 'City must have at least 2 symbols',
      }],
    });

  $('#address-validation').dxTextBox({
    validationMessagePosition: 'left',
    inputAttr: { 'aria-label': 'Address' },
  })
    .dxValidator({
      validationRules: [{
        type: 'required',
        message: 'Address is required',
      }],
    });

  $('#phone-validation').dxTextBox({
    mask: '+1 (X00) 000-0000',
    inputAttr: { 'aria-label': 'Phone' },
    maskRules: {
      X: /[02-9]/,
    },
    maskInvalidMessage: 'The phone must have a correct USA phone format',
    validationMessagePosition: 'left',
  }).dxValidator({
    validationRules: [{
      type: 'pattern',
      pattern: /^[02-9]\d{9}$/,
      message: 'The phone must have a correct USA phone format',
    }],
  });

  $('#check').dxCheckBox({
    value: false,
    text: 'I agree to the Terms and Conditions',
    validationMessagePosition: 'right',
  }).dxValidator({
    validationRules: [{
      type: 'compare',
      comparisonTarget() { return true; },
      message: 'You must agree to the Terms and Conditions',
    }],
  });

  $('#form').on('submit', (e) => {
    DevExpress.ui.notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);

    e.preventDefault();
  });

  $('#button').dxButton({
    width: '120px',
    text: 'Register',
    type: 'default',
    useSubmitBehavior: true,
  });
});
