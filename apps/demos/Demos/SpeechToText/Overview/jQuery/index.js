$(() => {
  const shouldUpdateType = () => displayMode.option('value') === 'Custom';
  let state = 'initial';

  const speechToText = $('#speech-to-text')
    .dxSpeechToText({
      type: 'default',
      hint: 'Start voice recognition',
      speechRecognitionConfig: {
        interimResults: true,
        continuous: false,
      },
      onStartClick: ({ component }) => {
        state = 'listening';
        component.option('hint', 'Stop voice recognition');
        if (!shouldUpdateType()) {
          return;
        }

        type.option('value', 'Danger');
      },
      onEnd: ({ component }) => {
        state = 'initial';
        component.option('hint', 'Start voice recognition');

        if (!shouldUpdateType()) {
          return;
        }

        type.option('value', 'Default');
      },
      onResult: ({ event }) => {
        const { results } = event;
        const resultText = Object.values(results)
          .map((resultItem) => resultItem[0].transcript)
          .join(' ');

        textArea.option('value', resultText);
      },
    })
    .dxSpeechToText('instance');

  const textArea = $('#text-area')
    .dxTextArea({
      width: 360,
      height: 120,
      placeholder: 'Recognized text will appear here...',
      inputAttr: { 'aria-label': 'Recognized Text' },
      onValueChanged: ({ value }) => {
        clearButton.option('disabled', !value);
      },
    })
    .dxTextArea('instance');

  const clearButton = $('#clear-button')
    .dxButton({
      text: 'Clear',
      disabled: true,
      onClick: () => {
        textArea.option('value', '');
      },
    })
    .dxButton('instance');

  const displayMode = $('#display-mode')
    .dxSelectBox({
      items: ['Icon Only', 'Text and Icon', 'Custom'],
      value: 'Icon Only',
      inputAttr: { 'aria-label': 'Display Mode' },
      onValueChanged: ({ value }) => {
        const $speechToText = speechToText.$element();
        const isCustomMode = value === 'Custom';
        stylingMode.option('disabled', isCustomMode);
        type.option('disabled', isCustomMode);
        $speechToText.removeClass('custom-button');

        if (value === 'Text and Icon') {
          speechToText.option({
            startText: 'Dictate',
            stopText: 'Stop',
          });
          return;
        }

        speechToText.option({ startText: '', stopText: '' });

        if (isCustomMode) {
          stylingMode.option('value', 'Contained');
          type.option('value', state === 'initial' ? 'Default' : 'Danger');
          $speechToText.addClass('custom-button');
        }
      },
    })
    .dxSelectBox('instance');

  const stylingMode = $('#styling-mode')
    .dxSelectBox({
      items: ['Contained', 'Outlined', 'Text'],
      value: 'Contained',
      inputAttr: { 'aria-label': 'Styling Mode' },
      onValueChanged: ({ value }) => {
        speechToText.option('stylingMode', value.toLowerCase());
      },
    })
    .dxSelectBox('instance');

  const type = $('#type')
    .dxSelectBox({
      items: ['Normal', 'Success', 'Default', 'Danger'],
      value: 'Default',
      inputAttr: { 'aria-label': 'Type' },
      onValueChanged: ({ value }) => {
        speechToText.option('type', value.toLowerCase());
      },
    })
    .dxSelectBox('instance');

  $('#disabled').dxSwitch({
    onValueChanged: ({ value }) => {
      speechToText.option('disabled', value);
    },
  });

  $('#language').dxSelectBox({
    items: ['Auto-detect', 'English', 'Spanish', 'French', 'German'],
    value: 'Auto-detect',
    inputAttr: { 'aria-label': 'Language' },
    onValueChanged: ({ value }) => {
      speechToText.option('speechRecognitionConfig.lang', langMap[value]);
    },
  });

  $('#interim-results').dxSwitch({
    value: true,
    onValueChanged: ({ value }) => {
      speechToText.option('speechRecognitionConfig.interimResults', value);
    },
  });

  $('#continuous-recognition').dxSwitch({
    onValueChanged: ({ value }) => {
      speechToText.option('speechRecognitionConfig.continuous', value);
    },
  });

  $('#animation').dxSwitch({
    value: true,
    onValueChanged: ({ value }) => {
      speechToText.$element().toggleClass('animation-disabled', !value);
    },
  });
});
