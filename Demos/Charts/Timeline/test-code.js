(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/viz/chart")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.viz.dxChart);
    }
})(function (dxChart) {
    var dataSource = [
        {
            monarch: "Anne",
            start: new Date(1701, 4, 1),
            end: new Date(1714, 7, 1),
            house: "Stuart"
        },
        {
            monarch: "George I",
            start: new Date(1714, 7, 1),
            house: "Hanover",
            end: new Date(1727, 5, 11)
        },
        {
            monarch: "George II",
            start: new Date(1727, 5, 11),
            house: "Hanover",
            end: new Date(1760, 9, 25)
        },
        {
            monarch: "George III",
            start: new Date(1760, 9, 25),
            house: "Hanover",
            end: new Date(1820, 0, 29)
        },
        {
            monarch: "George IV",
            start: new Date(1820, 0, 29),
            house: "Hanover",
            end: new Date(1830, 5, 26)
        },
        {
            monarch: "William IV",
            start: new Date(1830, 5, 26),
            house: "Hanover",
            end: new Date(1837, 5, 20)
        },
        {
            monarch: "Victoria",
            start: new Date(1837, 5, 20),
            end: new Date(1901, 0, 22),
            house: "Hanover"
        },
        {
            monarch: "Edward VII",
            start: new Date(1901, 0, 22),
            house: "Saxe-Coburg and Gotha",
            end: new Date(1910, 4, 6)
        },
        {
            monarch: "George V",
            start: new Date(1910, 4, 6),
            house: "Saxe-Coburg and Gotha",
            end: new Date(1917, 5, 17)
        },
        {
            monarch: "George V",
            start: new Date(1917, 5, 17),
            house: "Windsor",
            end: new Date(1936, 0, 20)
        },
        {
            monarch: "Edward VIII",
            start: new Date(1936, 0, 20),
            house: "Windsor",
            end: new Date(1936, 11, 11)
        },
        {
            monarch: "George VI",
            start: new Date(1936, 11, 11),
            house: "Windsor",
            end: new Date(1952, 1, 6)
        },
        {
            monarch: "Elizabeth II",
            house: "Windsor",
            start: new Date(1952, 1, 6),
            end: new Date(2019, 3, 30),
        },
        {
            house: "Stuart",
            start: new Date(1701, 4, 1),
            end: new Date(1714, 7, 1),
            monarch: "Royal Houses"
        },
        {
            end: new Date(1901, 0, 22),
            house: "Hanover",
            start: new Date(1714, 7, 1),
            monarch: "Royal Houses"
        },
        {
            start: new Date(1901, 0, 22),
            end: new Date(1917, 5, 17),
            house: "Saxe-Coburg and Gotha",
            monarch: "Royal Houses"
        },
        {
            house: "Windsor",
            start: new Date(1917, 5, 17),
            end: new Date(2019, 3, 30),
            monarch: "Royal Houses"
        }
    ];

    // MVC data
    dataSource.forEach(function (item) {
        item.House = item.house;
        item.Start = item.start;
        item.End = item.end;
        item.Monarch = item.monarch;
    });

    var instance = dxChart.getInstance(document.getElementById("chart"));
    instance.option("dataSource", dataSource);
    instance.option = function () { };
});

