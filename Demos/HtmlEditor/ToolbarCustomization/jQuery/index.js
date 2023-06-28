$(() => {
  let popupInstance;
  const editorInstance = $('.html-editor').dxHtmlEditor({
    value: markup,
    toolbar: {
      items: [
        'undo', 'redo', 'separator',
        {
          name: 'header',
          acceptedValues: [false, 1, 2, 3, 4, 5],
          options: { inputAttr: { 'aria-label': 'Header' } },
        }, 'separator',
        'bold', 'italic', 'strike', 'underline', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
        {
          widget: 'dxButton',
          options: {
            text: 'Show markup',
            stylingMode: 'text',
            onClick() {
              popupInstance.show();
            },
          },
        },
      ],
    },
  }).dxHtmlEditor('instance');

  popupInstance = $('#popup').dxPopup({
    showTitle: true,
    title: 'Markup',
    onShowing() {
      $('.value-content').text(editorInstance.option('value'));
    },
  }).dxPopup('instance');
});
