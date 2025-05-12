$(() => {
  $('.html-editor').dxHtmlEditor({
    height: 725,
    value: markup,
    toolbar: {
      items: [
        'ai', 'separator', 'undo', 'redo',
      ],
    }
  });
});
