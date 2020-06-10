$(function(){
    $("#first-name").dxTextBox({
        value: "John",
        name: "FirstName"
    });
    
    $("#last-name").dxTextBox({
        value: "Smith",
        name: "LastName"
    });
    
    $("#file-uploader").dxFileUploader({
        selectButtonText: "Select photo",
        labelText: "",
        accept: "image/*",
        uploadMode: "useForm"
    });
    
    $("#button").dxButton({
        text: "Update profile",
        type: "success",
        onClick: function(){
            DevExpress.ui.dialog.alert("Uncomment the line to enable sending a form to the server.", "Click Handler");
            //$("#form").submit();
        }
    });
});