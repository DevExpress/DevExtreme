window.onload = function() {
    var employeesStore = new DevExpress.data.ArrayStore({
            key: "ID",
            data: employees
        }),
        selectedItemKeys = ko.observableArray(),
        disabled = ko.observable(true);
    
    var viewModel = {    
        dataGridOptions: {
            dataSource: employeesStore,
            showBorders: true,
            paging: {
                enabled: false
            },
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            selection: {
                mode: "multiple"
            },
            onSelectionChanged: function(data) {
                selectedItemKeys(data.selectedRowKeys);
                disabled(!selectedItemKeys().length);
            }, 
            columns: [
                {
                    dataField: "Prefix",
                    caption: "Title",
                    width: 55
                },
                "FirstName",
                "LastName", {
                    dataField: "Position",
                    width: 170
                }, {
                    dataField: "StateID",
                    caption: "State",
                    width: 125,
                    lookup: {
                        dataSource: states,
                        displayExpr: "Name",
                        valueExpr: "ID"
                    }
                }, {
                    dataField: "BirthDate",
                    dataType: "date"
                }
            ]
        },
        buttonOptions: {
            text: "Delete Selected Records",
            height: 34,
            disabled: disabled,
            onClick: function () {
                $.each(selectedItemKeys(), function() {
                    employeesStore.remove(this);
                });
                $("#gridContainer").dxDataGrid("instance").refresh();       
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};