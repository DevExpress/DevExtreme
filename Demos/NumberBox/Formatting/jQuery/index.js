$(function(){
    $("#currency").dxNumberBox({
        format: "$ #,##0.##",
        value: 14500.55
    });

    $("#accounting").dxNumberBox({
        format: "$ #,##0.##;($ #,##0.##)",
        value: -2314.12
    });
    
    $("#percent").dxNumberBox({
        format: "#0%",
        value: 0.15,
        step: 0.01
    });
    
    $("#fixedPoint").dxNumberBox({
        format: "#,##0.00",
        value: 13415.24
    });

    $("#weight").dxNumberBox({
        format: "#0.## kg",
        value: 3.14
    });
});