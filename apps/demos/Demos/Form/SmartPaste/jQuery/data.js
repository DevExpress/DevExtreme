const deployment = 'gpt-4o-mini';
const apiVersion = '2024-02-01';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiKey = 'DEMO';

const items = [{
  itemType: 'group',
  caption: 'Billing Summary',
  colCountByScreen: {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  },
  items: [{
    dataField: 'Amount Due',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: '0.00 $',
      stylingMode: 'filled',
    },
    aiOptions: {
      instruction: 'format amount due like 0.00 $',
    },
  }, {
    dataField: 'Statement Date',
    editorType: 'dxDateBox',
    editorOptions: {
      placeholder: '00/00/0000',
      stylingMode: 'filled',
    },
    aiOptions: {
      instruction: 'format date mm/dd/yyyy',
    },
  }],
}, {
  itemType: 'group',
  caption: 'Billing Information',
  colCountByScreen: {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  },
  items: [{
    dataField: 'First Name',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: 'Enter First Name',
      stylingMode: 'filled',
    },
  }, {
    dataField: 'Last Name',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: 'Enter Last Name',
      stylingMode: 'filled',
    },
  }, {
    dataField: 'Phone Number',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: '(000) 000-0000',
      stylingMode: 'filled',
    },
    aiOptions: {
      instruction: 'format phone number like (000) 000-0000',
    },
  }, {
    dataField: 'Email',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: 'Enter Email',
      stylingMode: 'filled',
    },
    validationRules: [{ type: 'email' }],
    aiOptions: {
      instruction: 'give result only if email is valid',
    },
  }]
}, {
  itemType: 'group',
  caption: 'Billing Address',
  colCountByScreen: {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  },
  items: [{
    dataField: 'Street Address',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: 'Enter Street Address',
      stylingMode: 'filled',
    },
  }, {
    dataField: 'City',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: 'Enter City',
      stylingMode: 'filled',
    },
  }, {
    dataField: 'State/Province/Region',
    editorType: 'dxTextBox',
    editorOptions: {
      placeholder: 'Enter State/Province/Region',
      stylingMode: 'filled',
    },
  }, {
    dataField: 'ZIP',
    editorType: 'dxNumberBox',
    editorOptions: {
      placeholder: 'Enter ZIP',
      stylingMode: 'filled',
      mode: 'text',
      value: null,
    },
    aiOptions: {
      instruction: 'postal code, if empty, calculate from address, if possible',
    },
  }]
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
    name: 'smartPaste',
    buttonOptions: {
      stylingMode: 'contained',
      type: 'default',
    },
  }, {
    itemType: 'button',
    name: 'reset',
    buttonOptions: {
      stylingMode: 'outlined',
      type: 'normal',
    },
  }],
}];

const defaultText = `Payment: Amount - $123.00
Statement Date: 10/15/2024
Name: John Smith
Contact: (123) 456-7890
Email: john@myemail.com
Address:
- 123 Elm St Apt 4B
- New York, NY 10001
`;