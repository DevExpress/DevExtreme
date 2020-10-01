window.onload = function () {  
    var selectedResource = ko.observable(resourcesList[0]);

    var resources = ko.observableArray([
        {
            fieldExpr: "roomId",
            allowMultiple: true,
            dataSource: rooms,
            label: "Room"
        }, {
            fieldExpr: "priorityId",
            allowMultiple: true,
            dataSource: priorities,
            label: "Priority"
        }, {
            fieldExpr: "ownerId",
            allowMultiple: true,
            dataSource: owners,
            label: "Owner"
        }]);

    var changeMainColor = function () {
        var resourcesData = resources();

        for(var i = 0; i < resourcesData.length; i++) {
            resourcesData[i].useColorAsDefault = resourcesData[i].label == selectedResource();
        }
        resources(resourcesData);
    };

    ko.computed(changeMainColor);

    var viewModel = {
        schedulerInstance: {
            dataSource: data,
            views: ["workWeek"],
            currentView: "workWeek",
            currentDate: new Date(2021, 4, 25),
            startDayHour: 9,
            endDayHour: 19,
            resources: resources,
            height: 600
        },
        resourcesSelectorOptions: {
            items: resourcesList,
            value: selectedResource,
            layout: "horizontal"
        }
    };

    ko.applyBindings(viewModel, document.getElementById("scheduler-demo"));
};