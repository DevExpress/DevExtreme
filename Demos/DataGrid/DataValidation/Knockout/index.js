window.onload = function() {
    const url = "https://js.devexpress.com/Demos/Mvc/api/DataGridEmployeesValidation";

    const viewModel = {
        dataGridOptions: {
            dataSource: DevExpress.data.AspNet.createStore({
                key: "ID",
                loadUrl: url,
                insertUrl: url,
                updateUrl: url,
                deleteUrl: url,
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            }),  
            repaintChangesOnly: true,
            columnAutoWidth: true,
            showBorders: true,
            paging: {
                enabled: false
            },
            editing: {
                mode: "batch",
                allowUpdating: true,
                allowAdding: true
            },
            columns: [{
                    dataField: "FirstName",
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "LastName",
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "Position",
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "Phone",
                    validationRules: [{ type: "required" }, {
                        type: "pattern",
                        message: 'Your phone must have "(555) 555-5555" format!',
                        pattern: /^\(\d{3}\) \d{3}-\d{4}$/i 
                    }]
                }, {
                    dataField: "Email",
                    validationRules: [{
                        type: "required" 
                    }, { 
                        type: "email" 
                    }, {
                        type: "async",
                        message: "Email address is not unique",
                        validationCallback: function(params) {
                            return $.ajax({
                                url: "https://js.devexpress.com/Demos/Mvc/RemoteValidation/CheckUniqueEmailAddress",
                                type: 'POST',
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    id: params.data.ID,
                                    email: params.value
                                })
                            });                      
                        }
                    }]
                }
            ]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};