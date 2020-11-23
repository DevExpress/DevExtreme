$(function(){
    var fileUploader = $("#file-uploader").dxFileUploader({
        multiple: false,
        accept: "*",
        value: [],
        uploadMode: "instantly",
        uploadUrl: "https://js.devexpress.com/Demos/NetCore/FileUploader/Upload",
        onValueChanged: function(e) {
            var files = e.value;
            if(files.length > 0) {
                $("#selected-files .selected-item").remove();
                $.each(files, function(i, file) {
                    var $selectedItem = $("<div />").addClass("selected-item");
                    $selectedItem.append(
                        $("<span />").html("Name: " + file.name + "<br/>"),
                        $("<span />").html("Size " + file.size + " bytes" + "<br/>"),
                        $("<span />").html("Type " + file.type + "<br/>"),
                        $("<span />").html("Last Modified Date: " + file.lastModifiedDate)
                    );
                    $selectedItem.appendTo($("#selected-files"));
                });
                $("#selected-files").show();
            }
            else
                $("#selected-files").hide();
        }
    }).dxFileUploader("instance");
    
    $("#accept-option").dxSelectBox({
        dataSource: [
            {name: "All types", value: "*"}, 
            {name: "Images", value: "image/*"}, 
            {name: "Videos", value: "video/*"}
        ],
        valueExpr: "value",
        displayExpr: "name",
        value: "*",
        onValueChanged: function(e) {
            fileUploader.option("accept", e.value);
        }
    });
    
    
    $("#upload-option").dxSelectBox({
        items: ["instantly", "useButtons"],
        value: "instantly",
        onValueChanged: function(e) {
            fileUploader.option("uploadMode", e.value);
        }
    });
    
    
    $("#multiple-option").dxCheckBox({
        value: false,
        text: "Allow multiple files selection",
        onValueChanged: function(e) {
            fileUploader.option("multiple", e.value);
        }
    });
});