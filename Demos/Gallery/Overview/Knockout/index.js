window.onload = function () {
  const loop = ko.observable(true);
  const slideShow = ko.observable(true);
  const showNavButtons = ko.observable(true);
  const showIndicator = ko.observable(true);
  const slideshowDelay = ko.computed(
    () => (slideShow() ? 2000 : 0),
  );

  const viewModel = {
    loop,
    slideShow,
    showNavButtons,
    showIndicator,
    galleryOptions: {
      dataSource: gallery,
      height: 300,
      slideshowDelay,
      loop,
      showNavButtons,
      showIndicator,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('simple-gallery'));
};
