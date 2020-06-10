window.onload = function() {
    var viewModel = {
        simple: {
            items: priorities,
            value: priorities[0]
        },
        disabled: {
            items: priorities,
            value: priorities[1],
            disabled: true
        },
        changeLayout: {
            items: priorities,
            value: priorities[0],
            layout: "horizontal"
        },
        customItemTemplate: {
            items: priorities,
            value: priorities[2],
            itemTemplate: function(itemData, _, itemElement){
                itemElement
                    .parent().addClass(itemData.toLowerCase())
                    .text(itemData);
            }
        },
        eventRadioGroupOptions: {
            items: priorities,
            value: priorities[0],
            onValueChanged: function(e) {
                viewModel.list (tasks.filter(function(item) {
                     return item.priority == e.value;
                }));
            }
        },
        list: ko.observableArray([tasks[1]])
    };
    
    ko.applyBindings(viewModel, document.getElementById("radio-group-demo"));
};