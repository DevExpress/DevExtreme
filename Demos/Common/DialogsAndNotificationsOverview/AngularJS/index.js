const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.ADD_TO_FAVORITES = 'Add to Favorites',
  $scope.REMOVE_FROM_FAVORITES = 'Remove from Favorites';
  $scope.houses = houses;
  $scope.currentHouse = $scope.houses[0];
  $scope.popupVisible = false;

  $scope.showHouse = function (house) {
    $scope.currentHouse = house;
    $scope.popupVisible = true;
  };

  $scope.changeFavoriteState = function () {
    const favoriteState = !$scope.currentHouse.Favorite;
    const message = `This item has been ${
      favoriteState ? 'added to' : 'removed from'
    } the Favorites list!`;
    $scope.currentHouse.Favorite = favoriteState;

    DevExpress.ui.notify({
      message,
      width: 450,
    },
    favoriteState ? 'success' : 'error',
    2000);
  };
});
