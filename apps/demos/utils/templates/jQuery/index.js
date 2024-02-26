$(() => {
  $('#button').dxButton({
    text: 'Click me',
    onClick() {
      // eslint-disable-next-line no-alert
      alert('Test!');
    },
  });
});
