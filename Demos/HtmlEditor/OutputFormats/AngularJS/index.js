const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.editorValue = markup;
  $scope.prettierFormat = function (markup) {
    return prettier.format(markup, {
      parser: 'html',
      plugins: prettierPlugins,
    });
  };
  $scope.htmlEditorOptions = {
    height: 300,
    toolbar: {
      items: [
        'undo', 'redo', 'separator',
        {
          name: 'size',
          acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
        },
        {
          name: 'font',
          acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
        },
        'separator',
        'bold', 'italic', 'strike', 'underline', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
        'color', 'background',
      ],
    },
    bindingOptions: {
      value: 'editorValue',
      valueType: 'editorValueType',
      prettierFormat: 'prettierFormat',
    },
  };

  $scope.buttonGroupOptions = {
    items: [{ text: 'Html' }, { text: 'Markdown' }],
    selectedItemKeys: ['Html'],
    onSelectionChanged(e) {
      $scope.editorValueType = e.addedItems[0].text.toLowerCase();
    },
  };
});
