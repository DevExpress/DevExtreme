window.onload = function() {
    var viewModel = function() {
        var that = this;

        that.formOptions = {
            formData: employee,
            items: [{
                itemType: "group",
                cssClass: "first-group",
                colCount: 4,
                items: [{
                    template: "<div class='form-avatar'></div>"
                }, {
                    itemType: "group",
                    colSpan: 3,
                    items: [{
                        dataField: "FirstName"
                    }, {
                        dataField: "LastName"
                    }, {
                        dataField: "BirthDate",
                        editorType: "dxDateBox",
                        editorOptions: {
                            width: "100%"
                        }
                    }]
                }]
            }, {
                itemType: "group",
                cssClass: "second-group",
                colCount: 2,
                items: [{
                    itemType: "group",
                    items: [{
                        dataField: "Address"
                    }, {
                        dataField: "City"
                    }, {
                        dataField: "Position",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            items: positions,
                            value: ""
                        }
                    }]
                }, {
                    itemType: "group",
                    items: [{
                        dataField: "State",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            items: states
                        },
                    }, {
                        dataField: "ZipCode"
                    }, {
                        dataField: "Mobile",
                        label: {
                            text: "Phone"
                        },
                        editorOptions: {
                            mask: "+1 (000) 000-0000"
                        }
                    }]
                }, {
                    colSpan: 2,
                    dataField: "Notes",
                    editorType: "dxTextArea",
                    editorOptions: {
                        height: 140
                    }
                }]
            }]
        };
    };
    ko.applyBindings(new viewModel(), document.getElementById("editors-overview"));
};