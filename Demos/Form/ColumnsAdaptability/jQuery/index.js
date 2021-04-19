$(function(){
    var form = $("#form").dxForm({
        formData: employee,
        labelLocation: "top",
        minColWidth: 233,
        colCount: "auto",
        colCountByScreen: {
            md: 4,
            sm: 2
        },
        screenByWidth: function(width) {
            return width < 720? "sm" : "md";
        }
    }).dxForm("instance");
    
    $("#useColCountByScreen").dxCheckBox({
        onValueChanged: function(e) {
            if(e.value) {
                form.option("colCountByScreen.sm", undefined);
                form.option("colCountByScreen.md", undefined);
            } else {
                form.option("colCountByScreen.sm", 2);
                form.option("colCountByScreen.md", 4);
            }
        },
        text: "Calculate the number of columns automatically",
        value: false
    });
});