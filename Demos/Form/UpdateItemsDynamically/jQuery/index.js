$(function() {
    var form = $("#form").dxForm({
        colCount: 2,
        formData: employee,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        itemType: "group",
                        caption: "Personal Data",
                        items: ["FirstName", "LastName", {
                            itemType: "simple",
                            editorType: "dxCheckBox",
                            editorOptions: {
                                text: "Show Address",
                                value: true,
                                onValueChanged: function(e) {
                                    form.itemOption("HomeAddress", "visible", e.value);
                                }
                            }
                        }]
                    },
                    {
                        itemType: "group",
                        items: [{
                            itemType: "group",
                            name: "HomeAddress",
                            caption: "Home Address",
                            items: ["Address", "City"]
                        }]
                    }
                ]
            },
            {
                itemType: "group",
                caption: "Phones",
                name: "phones-container",
                items: [
                    {
                        itemType: "group",
                        name: "phones",
                        items: getPhonesOptions(employee.Phones)
                    },
                    {
                        itemType: "button",
                        horizontalAlignment: "left",
                        cssClass: "add-phone-button",
                        buttonOptions: {
                            icon: "add",
                            text: "Add phone",
                            onClick: function() {
                                employee.Phones.push("");
                                form.itemOption("phones-container.phones", "items", getPhonesOptions(employee.Phones));
                            }
                        }
                    }
                ]
            }
        ]
    }).dxForm("instance");

    function getPhonesOptions(phones) {
        var options = [];
        for (var i = 0; i < phones.length; i++){
            options.push(generateNewPhoneOptions(i));
        }
        return options;
    }

    function generateNewPhoneOptions(index) {
        return {
            dataField: "Phones[" + index + "]",
            editorType: "dxTextBox",
            cssClass: "phone-editor",
            label: {
                text: "Phone "+(index + 1)
            },
            editorOptions: {
                mask: "+1 (X00) 000-0000",
                maskRules: {"X": /[01-9]/},
                buttons: [{
                    name: "trash",
                    location: "after",
                    options: {
                        stylingMode: "text",
                        icon: "trash",
                        onClick: function() {
                            employee.Phones.splice(index, 1);
                            form.itemOption("phones-container.phones", "items", getPhonesOptions(employee.Phones));
                        }
                    }
                }]
            }
        }
    }

});
