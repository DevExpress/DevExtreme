var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentProduct = simpleProducts[0];
    $scope.productsDataSource = new DevExpress.data.DataSource({
        store: {
            data: simpleProducts,
            type: "array",
            key: "ID"
        }
    });

    $scope.searchModeOption = "contains";
    $scope.searchExprOption = "Name";
    $scope.searchTimeoutOption = 200;
    $scope.minSearchLengthOption = 0;
    $scope.showDataBeforeSearchOption = false;
    $scope.searchExprItems =[{
        name: "'Name'",
        value: "Name"
    }, {
        name: "['Name', 'Category']",
        value: ['Name', 'Category']
    }]

    $scope.selectBox = {
        searchBoxOptions: {
            dataSource: products,
            displayExpr: "Name",
            valueExpr: "ID",
            searchEnabled: true,
            bindingOptions: {
                searchMode: "searchModeOption",
                searchExpr: "searchExprOption",
                searchTimeout: "searchTimeoutOption",
                minSearchLength: "minSearchLengthOption",
                showDataBeforeSearch: "showDataBeforeSearchOption"
            }
        },

        editBoxOptions: {
            acceptCustomValue: true,
            dataSource: $scope.productsDataSource,
            displayExpr: "Name",
            valueExpr: "ID",
            value: simpleProducts[0].ID,
            bindingOptions: {
                selectedItem: "currentProduct",
            },
            onCustomItemCreating: function(data) {
                if(!data.text) {
                    data.customItem = null;
                    return;
                }

                var productIds = simpleProducts.map(function(item) {
                    return item.ID;
                });
                var incrementedId = Math.max.apply(null, productIds) + 1;
                var newItem = {
                    Name: data.text,
                    ID: incrementedId
                };

                data.customItem = $scope.productsDataSource.store().insert(newItem)
                .then(() => $scope.productsDataSource.load())
                .then(() => {
                    return newItem;
                })
                .catch((error) => {
                    throw error;
                });
            }
        }
    };
    $scope.demoOptions = {
        searchModeOptions: {
            items: ["contains", "startswith"],
            bindingOptions: {
                value: "searchModeOption"
            }
        },
        searchExprOptions: {
            items: $scope.searchExprItems,
            displayExpr: "name",
            valueExpr: "value",
            bindingOptions: {
                value: "searchExprOption"
            }
        },
        searchTimeoutOptions: {
            min: 0,
            max: 5000,
            value: 200,
            showSpinButtons: true,
            step: 100,
            bindingOptions: {
                value: "searchTimeoutOption"
            }
        },
        minSearchLengthOptions: {
            min: 0,
            max: 5,
            value: 0,
            showSpinButtons: true,
            bindingOptions: {
                value: "minSearchLengthOption"
            }
        },
        showDataBeforeSearchOptions: {
            value: false,
            text: "Show Data Before Search",
            bindingOptions: {
                value: "showDataBeforeSearchOption"
            }
        }
    }
});