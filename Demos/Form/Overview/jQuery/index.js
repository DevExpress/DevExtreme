$(function(){
    var form = $("#form").dxForm({
        formData: companies[0],
        readOnly: false,
        showColonAfterLabel: true,
        labelLocation: "top",
        minColWidth: 300,
        colCount: 2
    }).dxForm("instance");
    
    $("#select-company").dxSelectBox({
        displayExpr: "Name",
        dataSource: companies,
        value: companies[0],
        onValueChanged: function(data) {
           form.option("formData", data.value);
        }
    });
    
    $("#label-location").dxSelectBox({
        items: ["left", "top"],
        value: "top",
        onValueChanged: function(data) {
           form.option("labelLocation", data.value);
        }
    });
    
    $("#columns-count").dxSelectBox({
        items: ["auto", 1, 2, 3],
        value: 2,
        onValueChanged: function(data) {
           form.option("colCount", data.value);
        }
    });
    
    $("#min-column-width").dxSelectBox({
        items: [150, 200, 300],
        value: 300,
        onValueChanged: function(data) {
           form.option("minColWidth", data.value);
        }
    });
    
    $("#width").dxNumberBox({
        value: undefined,
        max: 550,
        onValueChanged: function(data) {
           form.option("width", data.value);
        }
    });
    
    $("#read-only").dxCheckBox({
        text: "readOnly",
        value: false,
        onValueChanged: function(data) {
           form.option("readOnly", data.value);
        }
    });
    
    $("#show-colon").dxCheckBox({
        text: "showColonAfterLabel",
        value: true,
        onValueChanged: function(data) {
           form.option("showColonAfterLabel", data.value);
        }
    });
});