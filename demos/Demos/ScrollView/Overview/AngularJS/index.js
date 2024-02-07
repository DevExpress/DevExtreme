const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let updateContentTimer;

  function updateContent(args, eventName) {
    const updateContentText = `\n \n Content has been updated on the ${eventName} event.`;
    if (updateContentTimer) { clearTimeout(updateContentTimer); }
    updateContentTimer = setTimeout(() => {
      $scope.content = (eventName === 'PullDown' ? `${updateContentText}\n${$scope.content}` : $scope.content + updateContentText);
      args.component.release();
    }, 500);
  }

  function updateBottomContent(e) {
    updateContent(e, 'ReachBottom');
  }

  $scope.updateTopContent = function (e) {
    updateContent(e, 'PullDown');
  };

  $scope.showScrollbarModes = [{
    text: 'On Scroll',
    value: 'onScroll',
  }, {
    text: 'On Hover',
    value: 'onHover',
  }, {
    text: 'Always',
    value: 'always',
  }, {
    text: 'Never',
    value: 'never',
  }];

  $scope.content = longText;
  $scope.showScrollbarMode = 'onScroll';
  $scope.scrollByContentValue = true;
  $scope.scrollByThumbValue = true;
  $scope.reachBottomValue = true;
  $scope.pullDownValue = false;

  $scope.updateBottomContent = updateBottomContent;

  $scope.$watch('reachBottomValue', (value) => {
    if (value) {
      $scope.updateBottomContent = updateBottomContent;
    } else {
      $scope.updateBottomContent = null;
    }
  });
});
