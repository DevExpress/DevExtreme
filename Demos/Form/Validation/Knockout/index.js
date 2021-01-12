window.onload = function() {
    var sendRequest = function(value) {
        var validEmail = "test@dx-email.com";
        var d = $.Deferred();
        setTimeout(function() {
            d.resolve(value === validEmail);
        }, 1000);
        return d.promise();
    }

    var formInstance;

    var viewModel = {
        formOptions: {
            formData: formData,
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: true,
            validationGroup: "customerData",
            onInitialized: function(e) {
                formInstance = e.component;
            },
            items: [{
                itemType: "group",
                caption: "Credentials",
                items: [{
                    dataField: "Email",
                    validationRules: [{
                        type: "required",
                        message: "Email is required"
                    }, {
                        type: "email",
                        message: "Email is invalid"
                    }, {
                        type: "async",
                        message: "Email is already registered",
                        validationCallback: function(params) {
                            return sendRequest(params.value);
                        }
                    }]
                }, {
                    dataField: "Password",
                    editorOptions: {
                        mode: "password",
                        value: ko.observable("")
                    },
                    validationRules: [{
                        type: "required",
                        message: "Password is required"
                    }]
                }, {
                    label: {
                        text: "Confirm Password"
                    },
                    editorType: "dxTextBox",
                    editorOptions: {
                        mode: "password"
                    },
                    validationRules: [{
                        type: "required",
                        message: "Confirm Password is required"
                    }, {
                        type: "compare",
                        message: "'Password' and 'Confirm Password' do not match",
                        comparisonTarget: function() {
                            return formInstance.option("formData").Password;
                        }
                    }]
                }]
            }, {
                itemType: "group",
                caption: "Personal Data",
                items: [{
                    dataField: "Name",
                    validationRules: [{
                        type: "required",
                        message: "Name is required"
                    }, {
                        type: "pattern",
                        pattern: "^[^0-9]+$",
                        message: "Do not use digits in the Name"
                    }]

                }, {
                    dataField: "Date",
                    editorType: "dxDateBox",
                    label: {
                        text: "Date of birth"
                    },
                    editorOptions: {
                        invalidDateMessage: "The date must have the following format: MM/dd/yyyy"
                    },
                    validationRules: [{
                        type: "required",
                        message: "Date of birth is required"
                    }, {
                        type: "range", 
                        max: new Date().setFullYear(new Date().getFullYear() - 21), 
                        message: "You must be at least 21 years old"
                    }]
                }]
            }, {
                itemType: "group",
                caption: "Billing address",
                items: [{
                    dataField: "Country",
                    editorType: "dxSelectBox",
                    editorOptions: {
                        dataSource: countries
                    },
                    validationRules: [{
                        type: "required",
                        message: "Country is required"
                    }]
                }, {
                    dataField: "City",
                    editorType: "dxAutocomplete",
                    editorOptions: {
                        dataSource: cities,
                        minSearchLength: 2
                    },
                    validationRules: [{
                        type: "pattern",
                        pattern: "^[^0-9]+$",
                        message: "Do not use digits in the City name"
                    }, {
                        type: "stringLength",
                        min: 2,
                        message: "City must have at least 2 symbols"
                    }, {
                        type: "required",
                        message: "City is required"
                    }]
                }, {
                    dataField: "Address",
                    validationRules: [{
                        type: "required",
                        message: "Address is required"
                    }]
                }, {
                    dataField: "Phone",
                    helpText: "Enter the phone number in USA phone format",
                    editorOptions: {
                        mask: "+1 (X00) 000-0000",
                        maskRules: {
                            "X": /[02-9]/
                        },
                        maskInvalidMessage: "The phone must have a correct USA phone format",
                        useMaskedValue: true
                    },
                     validationRules: [{
                        type: "pattern",
                        pattern: /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/,
                        message: "The phone must have a correct USA phone format"
                    }]
                }, {
                    dataField: "Accepted",
                    label: {
                        visible: false
                    },
                    editorOptions: {
                        text: "I agree to the Terms and Conditions"
                    },
                    validationRules: [{
                        type: "compare",
                        comparisonTarget: function() { return true; },
                        message: "You must agree to the Terms and Conditions"
                    }]
                }]
            }, {
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: "Register",
                    type: "success",
                    useSubmitBehavior: true
                }
            }]
        },
        onFormSubmit: function() {
            DevExpress.ui.notify({
                message: "You have submitted the form",
                position: {
                    my: "center top",
                    at: "center top"
                }
            }, "success", 3000);

            return false;
        }
    };

    ko.applyBindings(viewModel, document.getElementById("form"));
};