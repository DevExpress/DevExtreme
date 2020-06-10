$(function(){
    var passwordEditor = $("#password").dxTextBox({
        placeholder: "password",
        mode: "password",
        value: "password",
        stylingMode: "filled",
        buttons: [{
            name: "password",
            location: "after",
            options: {
                icon: "../../../../images/icons/eye.png",
                type: "default",
                onClick: function() {
                    passwordEditor.option("mode", passwordEditor.option("mode") === "text" ? "password" : "text");
                }
            }
        }]
    }).dxTextBox("instance");

    var currencyEditor = $("#multicurrency").dxNumberBox({
        value: 14500.55,
        format: "$ #.##",
        showClearButton: true,
        showSpinButtons: true,
        buttons: [{
            name: "currency",
            location: "after",
            options: {
                text: "€",
                stylingMode: "text",
                width: 32,
                elementAttr: {
                    class: "currency"
                },
                onClick: function(e) {
                    if(e.component.option("text") === "$") {
                        e.component.option("text", "€");
                        currencyEditor.option("format", "$ #.##");
                        currencyEditor.option("value", currencyEditor.option("value") / 0.891);
                    } else {
                        e.component.option("text", "$");
                        currencyEditor.option("format", "€ #.##");
                        currencyEditor.option("value", currencyEditor.option("value") * 0.891);
                    }
                }
            }
        }, "clear", "spins"]
    }).dxNumberBox("instance");

    var millisecondsInDay = 24 * 60 * 60 * 1000;

    var dateEditor = $("#advanced-datebox").dxDateBox({
        value: new Date().getTime(),
        stylingMode: "outlined",
        buttons: [{
            name: "today",
            location: "before",
            
            options: {
                text: "Today",
                onClick: function() {
                    dateEditor.option("value", new Date().getTime());
                }
            }
        }, {
            name: "prevDate",
            location: "before",
            options: {
                icon: "spinprev",
                stylingMode: "text",
                onClick: function() {
                    var currentDate = dateEditor.option("value");
                    dateEditor.option("value", currentDate - millisecondsInDay);
                }
            }
        }, {
            name: "nextDate",
            location: "after",
            options: {
                icon: "spinnext",
                stylingMode: "text",
                onClick: function() {
                    var currentDate = dateEditor.option("value");
                    dateEditor.option("value", currentDate + millisecondsInDay);
                }
            }
        }, "dropDown"]
    }).dxDateBox("instance");
});
