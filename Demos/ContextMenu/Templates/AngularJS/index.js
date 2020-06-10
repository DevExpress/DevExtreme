var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {    
    $scope.contextMenuOptions = {
        dataSource: contextMenuItems,
        width: 200,
        target: '#image',
        itemTemplate: function (itemData, itemIndex, itemElement) {
            var template = $('<div></div>');
            if(itemData.icon){
                template.append('<span class="' + itemData.icon + '"><span>');
            }
            if(itemData.items){            
                template.append('<span class="dx-icon-spinright"><span>');
            }
            template.append(itemData.text);        
            return template;
        },
        onItemClick: function(e){
            if (!e.itemData.items) {
                DevExpress.ui.notify("The \"" + e.itemData.text + "\" item was clicked", "success", 1500);
            }
        }
    };    
});