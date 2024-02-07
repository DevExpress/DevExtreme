const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.multilineToolbar = true;
  $scope.currentTabs = tabs[2].value;

  $scope.htmlEditorOptions = {
    bindingOptions: {
      'toolbar.multiline': 'multilineToolbar',
      'imageUpload.tabs': 'currentTabs',
    },
    height: 725,
    value: markup,
    toolbar: {
      items: [
        'undo', 'redo', 'separator',
        {
          name: 'size',
          acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
          options: { inputAttr: { 'aria-label': 'Font size' } },
        },
        {
          name: 'font',
          acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
          options: { inputAttr: { 'aria-label': 'Font family' } },
        },
        'separator', 'bold', 'italic', 'strike', 'underline', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
        'orderedList', 'bulletList', 'separator',
        {
          name: 'header',
          acceptedValues: [false, 1, 2, 3, 4, 5],
          options: { inputAttr: { 'aria-label': 'Header' } },
        }, 'separator',
        'color', 'background', 'separator',
        'link', 'image', 'separator',
        'clear', 'codeBlock', 'blockquote', 'separator',
        'insertTable', 'deleteTable',
        'insertRowAbove', 'insertRowBelow', 'deleteRow',
        'insertColumnLeft', 'insertColumnRight', 'deleteColumn',
      ],
    },
    mediaResizing: {
      enabled: true,
    },
    imageUpload: {
      fileUploadMode: 'base64',
    },
  };

  $scope.multilineSwitcherOptions = {
    bindingOptions: {
      value: 'multilineToolbar',
    },
    text: 'Multiline toolbar',
  };

  $scope.imageUploadTabsOptions = {
    items: tabs,
    bindingOptions: {
      value: 'currentTabs',
    },
    valueExpr: 'value',
    displayExpr: 'name',
  };
});
