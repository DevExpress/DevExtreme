$(() => {
  let employee = null;
  const popupContentTemplate = function () {
    return $('<div>').append(
      $(`<p>Full Name: <span>${employee.FirstName}</span>
                         <span>${employee.LastName}</span></p>`),
      $(`<p>Birth Date: <span>${employee.BirthDate}</span></p>`),
      $(`<p>Address: <span>${employee.Address}</span></p>`),
      $(`<p>Hire Date: <span>${employee.HireDate}</span></p>`),
      $(`<p>Position: <span>${employee.Position}</span></p>`),
    );
  };
  const popup = $('#popup').dxPopup({
    contentTemplate: popupContentTemplate,
    width: 300,
    height: 280,
    container: '.dx-viewport',
    showTitle: true,
    title: 'Information',
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
    showCloseButton: false,
    position: {
      at: 'bottom',
      my: 'center',
      collision: 'fit',
    },
    toolbarItems: [{
      locateInMenu: 'always',
      widget: 'dxButton',
      toolbar: 'top',
      options: {
        text: 'More info',
        onClick() {
          const message = `More info about ${employee.FirstName} ${employee.LastName}`;

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
      location: 'before',
      options: {
        icon: 'email',
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
        onClick() {
          popup.hide();
        },
      },
    }],
  }).dxPopup('instance');

  employees.forEach((currentEmployee) => {
    $('<li>').append(
      $('<img>').attr('src', currentEmployee.Picture).attr('id', `image${currentEmployee.ID}`),
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
              contentTemplate: () => popupContentTemplate(),
              'position.of': `#image${employee.ID}`,
            });
            popup.show();
          },
        }),
    ).appendTo($('#employees'));
  });
});
