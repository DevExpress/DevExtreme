$(() => {
  $('#show-popup-button').dxButton({
    text: 'Show Popup',
    width: 300,
    type: 'default',
    onClick() {
      popup.show();
    },
  });

  $('#show-popup-with-scrollview-button').dxButton({
    text: 'Show Popup',
    width: 300,
    onClick() {
      popupWithScrollView.show();
    },
  });

  const popup = $('#popup')
    .dxPopup({
      width: 360,
      height: 320,
      visible: false,
      title: 'Downtown Inn',
      hideOnOutsideClick: true,
      showCloseButton: true,
      toolbarItems: [
        {
          widget: 'dxButton',
          toolbar: 'bottom',
          location: 'center',
          options: {
            width: 300,
            text: 'Book',
            type: 'default',
            stylingMode: 'contained',
            onClick() {
              popup.hide();
            },
          },
        },
      ],
    })
    .dxPopup('instance');

  const popupWithScrollView = $('#popup-with-scrollview')
    .dxPopup({
      width: 360,
      height: 320,
      visible: false,
      title: 'Downtown Inn',
      hideOnOutsideClick: true,
      showCloseButton: true,
      toolbarItems: [
        {
          widget: 'dxButton',
          toolbar: 'bottom',
          location: 'center',
          options: {
            width: 300,
            text: 'Book',
            type: 'default',
            stylingMode: 'contained',
            onClick() {
              popupWithScrollView.hide();
            },
          },
        },
      ],
      contentTemplate() {
        const $scrollView = $('<div/>');

        $scrollView.append($('<div/>').html(htmlContent));

        $scrollView.dxScrollView({
          width: '100%',
          height: '100%',
        });

        return $scrollView;
      },
    })
    .dxPopup('instance');
});
