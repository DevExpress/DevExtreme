$(function(){
    var gauge = $("#gauge").dxCircularGauge({
        scale: {
            startValue: 10, 
    		endValue: 40,
            tickInterval: 5,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " kV";
                }
            }
        },
        tooltip: { enabled: true },
        title: {
            text: "Generators Voltage (kV)",
            font: { size: 28 }
        },
        value: 34,
        subvalues: [12, 23]
    }).dxCircularGauge("instance");
    
    var mainGenerator = $("#main-generator").dxNumberBox({
        value: 34,
        min: 10,
        max: 40,
        width: 100,
        showSpinButtons: true
    }).dxNumberBox("instance");
    
    var additionalGeneratorOne = $("#additional-generator-one").dxNumberBox({
        value: 12,
        min: 10,
        max: 40,
        width: 100,
        showSpinButtons: true
    }).dxNumberBox("instance");
    
    var additionalGeneratorTwo = $("#additional-generator-two").dxNumberBox({
        value: 23,
        min: 10,
        max: 40,
        width: 100,
        showSpinButtons: true
    }).dxNumberBox("instance");
    
    $("#edit").dxButton({
        text: "Apply",
        width: 100,
        onClick: function() {        
            gauge.value(mainGenerator.option("value"));
            gauge.subvalues([additionalGeneratorOne.option("value"), additionalGeneratorTwo.option("value")]);                
        }
    });
});