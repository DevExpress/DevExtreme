$(function() {
    var BASE_PATH = "https://js.devexpress.com/Demos/NetCore/";
    var url = BASE_PATH + "api/DataGridCollaborativeEditing/";
    var groupId = new DevExpress.data.Guid().toJSON();

    var createStore = function() {
        return DevExpress.data.AspNet.createStore({
            key: "ID",
            loadUrl: url,
            insertUrl: url,
            updateUrl: url,
            deleteUrl: url,
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.data.groupId = groupId;
            }
        })
    };

    var createDataGrid = function(gridId, store) {
        $("#" + gridId).dxDataGrid({
            dataSource: store,
            height: 600,
            showBorders: true,
            repaintChangesOnly: true,
            highlightChanges: true,
            paging: {
                enabled: false
            },
            editing: {
                mode: "cell",
                refreshMode: "reshape",
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true,
                useIcons: true
            },
            columns: [
                {
                    dataField: "Prefix",
                    caption: "Title",
                    width: 50,
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "FirstName",
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "StateID",
                    caption: "State",
                    lookup: {
                        dataSource: DevExpress.data.AspNet.createStore({
                            "key": "ID",
                            "loadUrl": BASE_PATH + "api/DataGridStatesLookup"
                        }),
                        displayExpr: "Name",
                        valueExpr: "ID"
                    },
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "BirthDate",
                    dataType: "date",
                    validationRules: [{
                        type: "range",
                        max: new Date(3000, 0),
                        message: "Date can not be greater than 01/01/3000"
                    }]
                }
            ]
        });
    };

    var store1 = createStore();
    var store2 = createStore();

    var updateStores = function(events) {
        store1.push(events);
        store2.push(events);
    };

    createDataGrid("grid1", store1);
    createDataGrid("grid2", store2);

    var hubUrl = BASE_PATH + 'dataGridCollaborativeEditingHub?GroupId=' + groupId;
    var connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start()
        .then(function() {
            connection.on("update", function(key, data) {
                updateStores([{ type: "update", key: key, data: data }]);
            });

            connection.on("insert", function(data) {
                updateStores([{ type: "insert", data: data }]);
            });

            connection.on("remove", function(key) {
                updateStores([{ type: "remove", key: key }]);
            });
        });
});
