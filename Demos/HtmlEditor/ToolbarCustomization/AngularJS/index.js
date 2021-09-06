const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.editorValue = markup;
  $scope.htmlEditorOptions = {
    toolbar: {
      items: [
        'undo', 'redo', 'separator',
        {
          name: 'header',
          acceptedValues: [false, 1, 2, 3, 4, 5],
        }, 'separator',
        'bold', 'italic', 'strike', 'underline', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
        {
          widget: 'dxButton',
          options: {
            text: 'Show markup',
            stylingMode: 'text',
            onClick() {
              $scope.visiblePopup = true;
            },
          },
        },
      ],
    },
    bindingOptions: {
      value: 'editorValue',
    },
  };

  $scope.popupOptions = {
    showTitle: true,
    title: 'Markup',
    onShowing() {
      $('.value-content').text($scope.editorValue);
    },
    bindingOptions: {
      visible: 'visiblePopup',
    },
  };
});
