$(function(){
    var store = DevExpress.data.AspNet.createStore({
        key: "ID",
        loadUrl: url + "/Tasks",
        updateUrl: url + "/UpdateTask",
        onBeforeSend: function(method, ajaxOptions) {
            ajaxOptions.xhrFields = { withCredentials: true };
        }
    });

    function getDataGridConfiguration(index) {
        return {
            height: 440,
            dataSource: {
                store: store,
                reshapeOnPush: true
            },
            showBorders: true,
            filterValue: ["Status", "=", index],
            rowDragging: {
                data: index,
                group: "tasksGroup",
                onAdd: onAdd
            },
            scrolling: {
                mode: "virtual"
            },
            columns: [{
                dataField: "Subject",
                dataType: "string"
             }, {
                dataField: "Priority",
                dataType: "number",
                width: 80,
                lookup: {
                    dataSource: priorities,
                    valueExpr: "id",
                    displayExpr: "text"
                },
            }, {
                dataField: "Status",
                dataType: "number",
                visible: false
            }]
        }
    }
    
    $("#grid1").dxDataGrid(getDataGridConfiguration(1));

    $("#grid2").dxDataGrid(getDataGridConfiguration(2));

    function onAdd(e) {
        var key = e.itemData.ID,
            values = { Status: e.toData };

        store.update(key, values).then(function() {
            store.push([{
                type: "update", key: key, data: values
            }])
        });
    }
});