$(function(){
    $("#radio-group-simple").dxRadioGroup({
        items: priorities,
        value: priorities[0]
    });
    
    $("#radio-group-disabled").dxRadioGroup({
        items: priorities,
        value: priorities[1],
        disabled: true
    });
    
    $("#radio-group-change-layout").dxRadioGroup({
        items: priorities,
        value: priorities[0],
        layout: "horizontal"
    });
    
    $("#radio-group-with-template").dxRadioGroup({
        items: priorities,
        value: priorities[2],
        itemTemplate: function(itemData, _, itemElement){
            itemElement
                .parent().addClass(itemData.toLowerCase())
                .text(itemData);
        }
    });
    
    var radioGroup = $("#radio-group-with-selection").dxRadioGroup({
        items: priorities,
        onValueChanged: function(e){
            $("#list").children().remove();
            $.each(tasks, function(i, item){
                if(item.priority == e.value) {
                    $("#list").append($("<li/>").text(tasks[i].subject));
                }
            });
        }
    }).dxRadioGroup("instance");
    
    radioGroup.option("value", priorities[0]);
});