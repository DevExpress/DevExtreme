window.onload = function () {
  const ViewModel = function () {
    const that = this;

    that.employees = ko.observableArray(employees);
    that.employee = ko.observable({});
    that.positionOf = ko.observable('');
    that.visiblePopup = ko.observable(false);

    that.popupOptions = {
      width: 300,
      height: 280,
      container: '.dx-viewport',
      contentTemplate: 'info',
      showTitle: true,
      title: 'Information',
      visible: that.visiblePopup,
      dragEnabled: false,
      hideOnOutsideClick: true,
      showCloseButton: false,
      position: {
        at: 'bottom',
        my: 'center',
        of: that.positionOf,
        collision: 'fit',
      },
      toolbarItems: [{
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'before',
        options: {
          icon: 'email',
          text: 'Send',
          onClick() {
            const message = `Email is sent to ${that.employee().FirstName} ${that.employee().LastName}`;
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
            that.visiblePopup(false);
          },
        },
      }],
    };

    that.showInfo = function (data) {
      that.employee(data.model);
      that.positionOf(`#image${that.employee().ID}`);
      that.visiblePopup(true);
    };
  };

  ko.applyBindings(new ViewModel(), document.getElementById('container'));
};
