window.onload = function() {
    var MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24,
        viewModel = {
            gridOptions: {
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
                        "Task_Priority",
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
                selectionFilter: ["Task_Status", "=", "Completed"],
                showBorders: true,
                onInitialized: function (e) {
                    viewModel.dataGrid = e.component;
                    calculateStatistics();
                },
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
            },

            buttonOptions: {
                text: "Get statistics on the selected tasks",
                type: "default",
                onClick: calculateStatistics
            },

            statistic: {
                count: ko.observable(0),
                peopleCount: ko.observable(0),
                avgDuration: ko.observable(0)
            }
        };

    function calculateStatistics() {
        viewModel.dataGrid.getSelectedRowsData().then(function (rowData) {
            var commonDuration = 0,
                statistic = viewModel.statistic;

            for (var i = 0; i < rowData.length; i++) {
                commonDuration += rowData[i].Task_Due_Date - rowData[i].Task_Start_Date;
            }
            commonDuration = commonDuration / MILLISECONDS_IN_DAY;

            statistic.count(rowData.length);
            statistic.peopleCount(
                DevExpress.data.query(rowData)
                .groupBy("ResponsibleEmployee.Employee_Full_Name")
                .toArray()
                .length
            );
            statistic.avgDuration(Math.round(commonDuration / rowData.length) || 0);
        });
    }


    ko.applyBindings(viewModel, document.getElementById("demo-container"));
};