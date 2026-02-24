$(() => {
  let employee = null;

  const popup = $('#popup').dxPopup({
    width: 450,
    height: 600,
    container: '.dx-viewport',
    visible: true,
    dragEnabled: false,
    toolbarItems: [{
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'before',
      options: {
        icon: 'email',
        stylingMode: 'contained',
        text: 'Send',
        onClick() {
          const message = `Email is sent to ${employee.FirstName} ${employee.LastName}`;
          DevExpress.ui.notify({
            message,
            position: {
              my: 'center top',
              at: 'center top',
            },
          }, 'success', 3000);
        },
      },
    }, {
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'after',
      options: {
        text: 'Close',
        stylingMode: 'outlined',
        type: 'normal',
        onClick() {
          popup.hide();
        },
      },
    }],
  }).dxPopup('instance');

  employees.forEach((currentEmployee) => {
    $('<li>').append(
      $('<img>')
        .attr('alt', `${currentEmployee.FirstName} ${currentEmployee.LastName}`)
        .attr('src', currentEmployee.Picture)
        .attr('id', `image${currentEmployee.ID}`),
      $('<br>'),
      $('<span>').html(`<i>${currentEmployee.FirstName}</i>`),
      $('<span>').html(` <i>${currentEmployee.LastName}</i>`),
      $('<br>'),
      $('<div>')
        .addClass('button-info')
        .dxButton({
          text: 'Details',
          onClick() {
            employee = currentEmployee;
            popup.option({
              'position.of': `#image${employee.ID}`,
            });
            popup.show();
          },
        }),
    ).appendTo($('#employees'));
  });
});
