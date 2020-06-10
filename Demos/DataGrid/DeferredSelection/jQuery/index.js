$(function(){
    var MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24,
        dataGrid;

    $("#grid-container").dxDataGrid({
        dataSource: {
            store: {
                type: "odata",
                url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks",
                key: "Task_ID"
            },
            expand: "ResponsibleEmployee",
            select: [
                "Task_ID",
                "Task_Subject",
                "Task_Start_Date",
                "Task_Due_Date",
                "Task_Status",
                "ResponsibleEmployee/Employee_Full_Name"
            ]
        },
        selection: {
            mode: "multiple",
            deferred: true
        },
        filterRow: {
            visible: true
        },
        onInitialized: function (e) {
            dataGrid = e.component;
            calculateStatistics();
        },
        selectionFilter: ["Task_Status", "=", "Completed"],
        showBorders: true,
        columns: [{
                caption: "Subject",
                dataField: "Task_Subject"
            }, {
                caption: "Start Date",
                dataField: "Task_Start_Date",
                width: "auto",
                dataType: "date"
            }, {
                caption: "Due Date",
                dataField: "Task_Due_Date",
                width: "auto",
                dataType: "date"
            }, {
                caption: "Assigned To",
                dataField: "ResponsibleEmployee.Employee_Full_Name",
                width: "auto",
                allowSorting: false
            }, {
                caption: "Status",
                width: "auto",
                dataField: "Task_Status"
            }]
    }).dxDataGrid("instance");

    function calculateStatistics() {
        dataGrid.getSelectedRowsData().then(function (rowData) {
            var commonDuration = 0;

            for (var i = 0; i < rowData.length; i++) {
                commonDuration += rowData[i].Task_Due_Date - rowData[i].Task_Start_Date;
            }
            commonDuration = commonDuration / MILLISECONDS_IN_DAY;

            $("#tasks-count").text(rowData.length);
            $("#people-count").text(
                DevExpress.data.query(rowData)
                .groupBy("ResponsibleEmployee.Employee_Full_Name")
                .toArray()
                .length
            );
            $("#avg-duration").text(Math.round(commonDuration / rowData.length) || 0);
        });
    }

    $("#calculateButton").dxButton({
        text: "Get statistics on the selected tasks",
        type: "default",
        onClick: calculateStatistics
    });
});