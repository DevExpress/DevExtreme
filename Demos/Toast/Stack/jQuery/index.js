let id = 1;
let direction = 'up-push';
let position = 'bottom center';

$(() => {
  $('#create').dxButton({
    text: 'Show',
    width: '48%',
    onClick() {
      DevExpress.ui.notify({
        message: `Toast ${id}`,
        height: 45,
        width: 150,
        minWidth: 150,
        type: types[Math.floor(Math.random() * 4)],
        displayTime: 3500,
        animation: {
          show: {
            type: 'fade', duration: 400, from: 0, to: 1,
          },
          hide: { type: 'fade', duration: 40, to: 0 },
        },
      },
      {
        position,
        direction,
      });
      id += 1;
    },
  });

  $('#hide').dxButton({
    text: 'Hide all',
    width: '48%',
    onClick() {
      DevExpress.ui.hideToasts();
    },
  });

  $('#radioGroup').dxRadioGroup({
    layout: 'horizontal',
    value: 'predefined',
    items: ['predefined', 'coordinates'],
    onValueChanged: ({ value }) => {
      const predefinedSelected = value === 'predefined';

      positionSelect.option('visible', predefinedSelected);
      topNumberBox.option('visible', !predefinedSelected);
      leftNumberBox.option('visible', !predefinedSelected);
      bottomNumberBox.option('visible', !predefinedSelected);
      rightNumberBox.option('visible', !predefinedSelected);
      position = predefinedSelected
        ? positionSelect.option('value')
        : {
          top: topNumberBox.option('value') || undefined,
          left: leftNumberBox.option('value') || undefined,
          bottom: bottomNumberBox.option('value') || undefined,
          right: rightNumberBox.option('value') || undefined,
        };
    },
  });

  const positionSelect = $('#position').dxSelectBox({
    items: positions,
    value: position,
    onSelectionChanged: ({ selectedItem }) => { position = selectedItem; },
  }).dxSelectBox('instance');

  $('#direction').dxSelectBox({
    items: directions,
    value: direction,
    onSelectionChanged: ({ selectedItem }) => { direction = selectedItem; },
  });

  const numberBoxValueChange = (value, pos, componentToDisable) => {
    position[pos] = value || undefined;
    componentToDisable.option('disabled', !!value);
  };

  const commonNumberBoxOptions = {
    value: '',
    width: '48%',
    visible: false,
    valueChangeEvent: 'keyup',
  };

  const topNumberBox = $('#positionTop').dxNumberBox({
    ...commonNumberBoxOptions,
    placeholder: 'top',
    inputAttr: { 'aria-label': 'Position Top' },
    onValueChanged: ({ value }) => numberBoxValueChange(value, 'top', bottomNumberBox),
  }).dxNumberBox('instance');

  const bottomNumberBox = $('#positionBottom').dxNumberBox({
    ...commonNumberBoxOptions,
    placeholder: 'bottom',
    inputAttr: { 'aria-label': 'Position Bottom' },
    onValueChanged: ({ value }) => numberBoxValueChange(value, 'bottom', topNumberBox),
  }).dxNumberBox('instance');

  const leftNumberBox = $('#positionLeft').dxNumberBox({
    ...commonNumberBoxOptions,
    placeholder: 'left',
    inputAttr: { 'aria-label': 'Position Left' },
    onValueChanged: ({ value }) => numberBoxValueChange(value, 'left', rightNumberBox),
  }).dxNumberBox('instance');

  const rightNumberBox = $('#positionRight').dxNumberBox({
    ...commonNumberBoxOptions,
    placeholder: 'right',
    inputAttr: { 'aria-label': 'Position Right' },
    onValueChanged: ({ value }) => numberBoxValueChange(value, 'right', leftNumberBox),
  }).dxNumberBox('instance');
});
