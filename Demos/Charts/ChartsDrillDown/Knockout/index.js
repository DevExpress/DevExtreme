window.onload = function() {
    var isFirstLevel = ko.observable(true),
        dataSource = ko.observable(filterData("")),
        buttonIsVisible = ko.computed(function () {
            return !isFirstLevel();
        });

    var viewModel = {
        chartOptions: {
            dataSource: dataSource,
            title: "The Most Populated Countries by Continents",
            series: {
                type: "bar"
            },
            legend: {
                visible: false
            },
            valueAxis: {
                showZero: false
            },
            onPointClick: function (e) {
                if (isFirstLevel()) {
                    isFirstLevel(false);
                    removePointerCursor();
                    dataSource(filterData(e.target.originalArgument));
                }
            },
            customizePoint: function () {
                var pointSettings = {
                    color: colors[Number(isFirstLevel())]
                };

                if (!isFirstLevel()) {
                    pointSettings.hoverStyle = {
                        hatching: "none"
                    };
                }

                return pointSettings;
            }
        },
        buttonOptions: {
            text: "Back",
            icon: "chevronleft",
            visible: buttonIsVisible,
            onClick: function () {
                if (!isFirstLevel()) {
                    isFirstLevel(true);
                    addPointerCursor();
                    dataSource(filterData(""));
                }
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));

    addPointerCursor();

    function filterData(name) {
        return data.filter(function (item) {
            return item.parentID === name;
        });
    }

    function addPointerCursor() {
        document.getElementById("chart").classList.add("pointer-on-bars");
    }

    function removePointerCursor() {
        document.getElementById("chart").classList.remove("pointer-on-bars");
    }
};