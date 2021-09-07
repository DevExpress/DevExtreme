window.onload = function () {
  const ViewModelLongTabs = function () {
    const that = this;
    that.tabOptions = {
      dataSource: longtabs,
    };
  };
  ko.applyBindings(new ViewModelLongTabs(), document.getElementById('longtabs'));

  const ViewModelScrolledTabs = function () {
    const that = this;
    that.tabOptions = {
      dataSource: longtabs,
      width: 300,
      scrollByContent: true,
      showNavButtons: true,
    };
  };
  ko.applyBindings(new ViewModelScrolledTabs(), document.getElementById('scrolledtabs'));

  const ViewModel = function () {
    const that = this;
    that.tabContent = ko.observable();
    that.selectedTab = ko.observable(0);
    that.tabOptions = {
      dataSource: tabs,
      selectedIndex: that.selectedTab,
    };
    that.selectBoxOptions = {
      value: that.selectedTab,
      dataSource: tabs,
      displayExpr: 'text',
      valueExpr: 'id',
    };
    ko.computed(() => {
      that.tabContent(tabs[that.selectedTab()].content);
    });
  };
  ko.applyBindings(new ViewModel(), document.getElementById('tabs'));
};
