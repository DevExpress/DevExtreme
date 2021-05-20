var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var arabicColumns = [{
            dataField: "nameAr",
            caption: "الدولة"
        }, {
            dataField: "capitalAr",
            caption: "عاصمة"
        }, {
            dataField: "population",
            format: {
                type: "fixedPoint",
                precision: 0
            },
            caption: "عدد السكان (نسمة) 2013"
        }, {
            dataField: "area",
            format: {
                type: "fixedPoint",
                precision: 0
            },
            headerCellTemplate: "arabicTemplate"
        }, {
            dataField: "accession",
            visible: false
        }],
        englishColumns = [{
            dataField: "nameEn",
            caption: "Name"
        }, {
            dataField: "capitalEn",
            caption: "Capital"
        }, {
            dataField: "population",
            format: {
                type: "fixedPoint",
                precision: 0
            },
        }, {
            dataField: "area",
            format: {
                type: "fixedPoint",
                precision: 0
            },
            headerCellTemplate: "englishTemplate"
        }, {
            dataField: "accession",
            visible: false
        }],
        languages = ["Arabic (Right-to-Left direction)", "English (Left-to-Right direction)"];
    
    $scope.searchPanel = {
        visible: true,
        placeholder: "Search..."
    };
    $scope.columns = englishColumns;
    $scope.rtlEnabledValue = false;
    
    $scope.dataGridOptions = {
        dataSource: europeanUnion,
        keyExpr: "nameEn",
        showBorders: true,
        paging: {
            pageSize: 15
        },
        bindingOptions: {
            searchPanel: "searchPanel",
            rtlEnabled: "rtlEnabledValue",
            columns: "columns"            
        }
    };
    
    $scope.selectLanguageOptions = {
        items: languages,
        value: languages[1],
        width: 250,
        onValueChanged: function(data) {
            var isRTL = data.value === languages[0];
            $scope.rtlEnabledValue = isRTL;
            $scope.columns = (isRTL) ? arabicColumns : englishColumns;
            $scope.searchPanel.placeholder = (isRTL) ? "بحث" : "Search...";       
        }
    };
});