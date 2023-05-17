$(() => {
  const passwordEditor = $('#password').dxTextBox({
    placeholder: 'password',
    mode: 'password',
    value: 'password',
    inputAttr: { 'aria-label': 'Password' },
    stylingMode: 'filled',
    buttons: [{
      name: 'password',
      location: 'after',
      options: {
        icon: '../../../../images/icons/eye.png',
        type: 'default',
        onClick() {
          passwordEditor.option('mode', passwordEditor.option('mode') === 'text' ? 'password' : 'text');
        },
      },
    }],
  }).dxTextBox('instance');

  const currencyEditor = $('#multicurrency').dxNumberBox({
    value: 14500.55,
    format: '$ #.##',
    showClearButton: true,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Multi Currency' },
    buttons: [{
      name: 'currency',
      location: 'after',
      options: {
        text: '€',
        stylingMode: 'text',
        width: 32,
        elementAttr: {
          class: 'currency',
        },
        onClick(e) {
          if (e.component.option('text') === '$') {
            e.component.option('text', '€');
            currencyEditor.option('format', '$ #.##');
            currencyEditor.option('value', currencyEditor.option('value') / 0.836);
          } else {
            e.component.option('text', '$');
            currencyEditor.option('format', '€ #.##');
            currencyEditor.option('value', currencyEditor.option('value') * 0.836);
          }
        },
      },
    }, 'clear', 'spins'],
  }).dxNumberBox('instance');

  const millisecondsInDay = 24 * 60 * 60 * 1000;

  const dateEditor = $('#advanced-datebox').dxDateBox({
    value: new Date().getTime(),
    stylingMode: 'outlined',
    inputAttr: { 'aria-label': 'Date' },
    buttons: [{
      name: 'today',
      location: 'before',

      options: {
        text: 'Today',
        onClick() {
          dateEditor.option('value', new Date().getTime());
        },
      },
    }, {
      name: 'prevDate',
      location: 'before',
      options: {
        icon: 'spinprev',
        stylingMode: 'text',
        onClick() {
          const currentDate = dateEditor.option('value');
          dateEditor.option('value', currentDate - millisecondsInDay);
        },
      },
    }, {
      name: 'nextDate',
      location: 'after',
      options: {
        icon: 'spinnext',
        stylingMode: 'text',
        onClick() {
          const currentDate = dateEditor.option('value');
          dateEditor.option('value', currentDate + millisecondsInDay);
        },
      },
    }, 'dropDown'],
  }).dxDateBox('instance');
});
