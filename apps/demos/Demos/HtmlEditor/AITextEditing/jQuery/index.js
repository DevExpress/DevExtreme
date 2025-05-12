$(() => {
  $('.html-editor').dxHtmlEditor({
    height: 725,
    value: markup,
    aiIntegration: {},
    toolbar: {
      items: [{
        name: 'ai',
        commands: [
            'summarize',
            'proofread',
            'expand',
            'shorten',
            'changeStyle',
            'changeTone',
            'translate',
            'askAI',
            {
                name: 'custom',
                text: 'Extract Keywords',
                prompt: () => {
                    return 'Extract a list of keywords from the text and return them as a comma-separated string';
                },
            },
        ],
      }, 'separator', 'undo', 'redo'
    ],
    }
  });
});
