$(function(){
    var form = $("#form").dxForm({
        formData: employee,
        labelLocation: "top",
        minColWidth: 233,
        colCount: "auto",
        colCountByScreen: {
            md: 3,
            sm: 2
        },
        screenByWidth: function(width) {
            return width < 720? "sm" : "md";
        }
    }).dxForm("instance");
    
    $("#useColCountByScreen").dxCheckBox({
        onValueChanged: function(e) {
            if(e.value) {
                form.option("colCountByScreen.sm", 2);
                form.option("colCountByScreen.md", 3);
            } else {
                form.option("colCountByScreen.sm", undefined);
                form.option("colCountByScreen.md", undefined);
            }
        },
        text: "Set the count of columns regardless of screen size",
        value: true
    });
    
    
});