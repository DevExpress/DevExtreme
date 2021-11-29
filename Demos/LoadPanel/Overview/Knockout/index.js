window.onload = function () {
  const ViewModel = function () {
    const that = this;

    that.employee = ko.observable({});
    that.loadingVisible = ko.observable(false);
    that.hideOnOutsideClick = ko.observable(false);
    that.showIndicator = ko.observable(true);
    that.showPane = ko.observable(true);
    that.shading = ko.observable(true);

    that.loadOptions = {
      visible: that.loadingVisible,
      showIndicator: that.showIndicator,
      showPane: that.showPane,
      shading: that.shading,
      hideOnOutsideClick: that.hideOnOutsideClick,
      shadingColor: 'rgba(0,0,0,0.4)',
      position: { of: '#employee' },
      onShown() {
        setTimeout(() => {
          that.loadingVisible(false);
        }, 3000);
      },
      onHidden() {
        that.employee(employee);
      },
    };

    that.showLoadPanel = function () {
      that.employee({});
      that.loadingVisible(true);
    };
  };

  ko.applyBindings(new ViewModel(), document.getElementById('container'));
};
