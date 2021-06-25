// This code is used for backwards compatibility with the older jsPDF variable name
// Read more: https://github.com/MrRio/jsPDF/releases/tag/v2.0.0
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);

$(function() {
    var ganttInstance = $("#gantt").dxGantt({
        rootValue: -1,
        tasks: {
            dataSource: tasks
        },
        dependencies: {
            dataSource: dependencies
        },
        resources: {
            dataSource: resources
        },
        resourceAssignments: {
            dataSource: resourceAssignments
        },
        editing: {
            enabled: true
        },
        columns: [{
            dataField: "title",
            caption: "Subject",
            width: 300
        }, {
            dataField: "start",
            caption: "Start Date"
        }, {
            dataField: "end",
            caption: "End Date"
        }],
        scaleType: "weeks",
        taskListWidth: 500,
        toolbar: {
            items: [
                "undo",
                "redo",
                "separator",
                "zoomIn",
                "zoomOut",
                "separator",
                {
                    widget: "dxButton",
                    options: {
                        icon: 'exportpdf',
                        hint: "Export to PDF",
                        stylingMode: "text",
                        onClick: function () {
                            exportGantt();
                        }
                    }
                }
            ]
        },
    }).dxGantt('instance');

    const formats = ["A0", "A1", "A2", "A3", "A4", "Auto"];
    const exportModes = [ "All", "Chart", "Tree List" ];
    const dataRanges = [ "All", "Visible", "Custom" ];

    $("#formatSelector").dxSelectBox({
        items: formats,
        value: formats[0]        
    });
    $("#landscapeCheckBoxContainer").dxCheckBox({
        value: true
    });
    $("#exportModeSelector").dxSelectBox({
        items: exportModes,
        value: exportModes[0]        
    });
    $("#dataRangeSelector").dxSelectBox({
        items: dataRanges,
        value: dataRanges[1],
        onValueChanged: function (data) {
            var disabled = data.value.toLowerCase() !== "custom";
            changeCustomRangeEditorsDisabled(disabled);
        }
    });
    $("#startIndexContainer").dxNumberBox({
        disabled: true,
        value: 0,
        showSpinButtons: true,
    });
    $("#endIndexContainer").dxNumberBox({
        disabled: true,
        value: 3,
        showSpinButtons: true,
    });
        
    $("#startDateContainer").dxDateBox({
        disabled: true,
        type: "date",
        value:  tasks[0].start,
                    
    });
    
    $("#endDateContainer").dxDateBox({
        disabled: true,
        type: "date",
        value: tasks[0].end
    });


    function exportGantt() {
        const format = $("#formatSelector").dxSelectBox("option", "value").toLowerCase();
        const isLandscape = $("#landscapeCheckBoxContainer").dxCheckBox("option", "value");
        let exportMode = $("#exportModeSelector").dxSelectBox("option", "value");
        exportMode = exportMode === "Tree List" ? "treeList" : exportMode.toLowerCase();
        const dataRangeMode = $("#dataRangeSelector").dxSelectBox("option", "value").toLowerCase();
        let dataRange;
        if(dataRangeMode === 'custom') {
            dataRange = { 
                    startIndex: $("#startIndexContainer").dxNumberBox("option", "value"), 
                    endIndex: $("#endIndexContainer").dxNumberBox("option", "value"),
                    startDate:  $("#startDateContainer").dxDateBox("option", "value"),
                    endDate: $("#endDateContainer").dxDateBox("option", "value")
            }
        }
        else {
            dataRange = dataRangeMode
        }
        ganttInstance.exportToPdf( 
            { 
                format: format, 
                landscape: isLandscape,
                exportMode: exportMode, 
                dateRange: dataRange
            }
        ).then(doc => {
            doc.save('gantt.pdf');
        });
    }
    function changeCustomRangeEditorsDisabled(disabled) {
        $("#startIndexContainer").dxNumberBox("instance").option("disabled", disabled);
        $("#endIndexContainer").dxNumberBox("instance").option("disabled", disabled);
        $("#startDateContainer").dxDateBox("instance").option("disabled", disabled);
        $("#endDateContainer").dxDateBox("instance").option("disabled", disabled);
    }
});
