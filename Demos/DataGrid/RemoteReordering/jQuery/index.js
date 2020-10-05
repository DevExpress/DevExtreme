$(function(){
    var url = "https://js.devexpress.com/Demos/Mvc/api/RowReordering",
        tasksStore = DevExpress.data.AspNet.createStore({
            key: "ID",
            loadUrl: url + "/Tasks",
            updateUrl: url + "/UpdateTask",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        }),
        employeesStore = DevExpress.data.AspNet.createStore({
            key: "ID",
            loadUrl: url + "/Employees",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });

        $("#gridContainer").dxDataGrid({
            height: 440,
            dataSource: tasksStore,
            remoteOperations: true,
            scrolling: {
                mode: "virtual"
            },
            sorting: {
                mode: "none"
            },
            rowDragging: {
                allowReordering: true,
                dropFeedbackMode: "push",
                onReorder: function(e) {
                    var visibleRows = e.component.getVisibleRows(),
                        newOrderIndex = visibleRows[e.toIndex].data.OrderIndex,
                        d = $.Deferred();

                    tasksStore.update(e.itemData.ID, { OrderIndex: newOrderIndex }).then(function() {
                        e.component.refresh().then(d.resolve, d.reject);
                    }, d.reject);

                    e.promise = d.promise();
                }
            },
            showBorders: true,
            columns: [{
                dataField: "ID",
                width: 55
            }, {
                dataField: "Owner",
                lookup: {
                    dataSource: employeesStore,
                    valueExpr: "ID",
                    displayExpr: "FullName"
                },
                width: 150
            }, {
                dataField: "AssignedEmployee",
                caption: "Assignee",
                lookup: {
                    dataSource: employeesStore,
                    valueExpr: "ID",
                    displayExpr: "FullName"
                },
                width: 150
            }, "Subject"]
        });
});