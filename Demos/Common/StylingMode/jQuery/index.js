$(function() {
    var stylingMode = readStylingMode() || "filled";
    DevExpress.config({
        editorStylingMode: stylingMode
    });

    $("#owner").dxTextBox({
        value: "Samantha Bright",
        width: "100%",
        placeholder: "Owner"
    });

    $("#subject").dxTextBox({
        value: "",
        width: "100%",
        placeholder: "Subject"
    }).dxValidator({
        validationRules: [{
            type: "required"
        }]
    });

    $("#date").dxDateBox({
        value: new Date(2020, 4, 3),
        width: "100%",
        placeholder: "Start Date"
    });

    $("#priority").dxSelectBox({
        items: [ "High", "Urgent", "Normal", "Low" ],
        value: "High",
        width: "100%",
        placeholder: "Priority"
    });

    $("#status").dxTagBox({
        items: [ "Not Started", "Need Assistance", "In Progress", "Deferred", "Completed" ],
        value: [ "Not Started" ],
        multiline: false,
        width: "100%",
        placeholder: "Status"
    });

    $("#details").dxTextArea({
        value: "Need sign-off on the new NDA agreement. It's important that this is done quickly to prevent any unauthorized leaks.",
        width: "100%",
        placeholder: "Details"
    });

    $("#validate").dxButton({
        text: "Save",
        type: "default",
        onClick: function (e) {
            var result = e.validationGroup.validate();
            if (result.isValid) {
                DevExpress.ui.notify("The task was saved successfully.", "success");
            } else {
                DevExpress.ui.notify("The task was not saved. Please check if all fields are valid.", "error");
            }
        }
    });

    $("#modeSelector").dxSelectBox({
        items: [ "outlined", "filled", "underlined" ],
        value: stylingMode,
        onValueChanged: function(e) {
            writeStylingMode(e.value);
        }
    });

    DevExpress.validationEngine.validateGroup();
});

var storageKey = "editorStylingMode";
function readStylingMode() {
    var mode = localStorage.getItem(storageKey);
    localStorage.removeItem(storageKey);
    return mode;
}

function writeStylingMode(mode) {
    localStorage.setItem(storageKey, mode);
    window.location.reload(true);
}
