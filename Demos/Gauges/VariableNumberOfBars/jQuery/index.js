$(function(){
    var productsToValues = function (){ 
        return $.map(products, function (item){
            return item.active ? item.count : null;
        });
    };
    
    var gauge = $("#gauge").dxBarGauge({
        startValue: 0,
        endValue: 50,
        values: productsToValues(),
        label: {
            format: {
                type: "fixedPoint",
                precision: 0
            }
        }
    }).dxBarGauge("instance");
    
    $("#panel").append($.map(products, function (product) {
        return $("<div></div>").dxCheckBox({
            value: product.active,
            text: product.name,
            onValueChanged: function(data) {        
                product.active = data.value;
                gauge.values(productsToValues());
            }    
        });
    }));
});