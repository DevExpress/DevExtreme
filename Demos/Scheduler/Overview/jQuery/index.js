$(function() {
    $(".scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2021, 7, 2, 11, 30),
        firstDayOfWeek: 1,
        startDayHour: 8,
        endDayHour: 18,
        showAllDayPanel: false,
        height: 600,
        groups: ["employeeID"],
        resources: [
            {
                fieldExpr: "employeeID",
                allowMultiple: false,
                dataSource: employees,
                label: "Employee"
            }
        ],
        dataCellTemplate: function (cellData, index, container) {
            var employeeID = cellData.groups.employeeID,
                currentTraining = getCurrentTraining(cellData.startDate.getDate(), employeeID);

            var wrapper = $("<div>")
                .toggleClass("employee-weekend-" + employeeID, isWeekEnd(cellData.startDate)).appendTo(container)
                .addClass("employee-" + employeeID)
                .addClass("dx-template-wrapper");

            wrapper.append($("<div>")
                .text(cellData.text)
                .addClass(currentTraining)
                .addClass("day-cell")
            );

        },
        resourceCellTemplate: function (cellData) {
            var name = $("<div>")
                .addClass("name")
                .css({ backgroundColor: cellData.color })
                .append($("<h2>")
                    .text(cellData.text));

            var avatar = $("<div>")
                .addClass("avatar")
                .html("<img src=" + cellData.data.avatar + ">")
                .attr("title", cellData.text);

            var info = $("<div>")
                .addClass("info")
                .css({ color: cellData.color })
                .html("Age: " + cellData.data.age + "<br/><b>" + cellData.data.discipline + "</b>");

            return $("<div>").append([name, avatar, info]);
        }
    });

    function isWeekEnd(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    }

    function getCurrentTraining(date, employeeID) {
        var result = (date + employeeID) % 3,
            currentTraining = "training-background-" + result;

        return currentTraining;
    }
});