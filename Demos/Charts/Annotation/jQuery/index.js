$(function() {
    $("#chart").dxChart({
        dataSource: dataSource,
        title: {
            text: "Apple Stock Price",
            subtitle: "AAPL"
        },
        series: {
            valueField: "close",
            name: "AAPL",
            argumentField: "date",
            type: "line"
        },
        legend: {
            visible: false,
        },
        argumentAxis: {
            argumentType: "datetime"
        },
        valueAxis: {
            position: "right"
        },
        commonAnnotationSettings: {
            series: "AAPL",
            type: "image",
            font: {
                size: 16,
                weight: 600
            },
            image: {
                width: 50.5,
                height: 105.75
            },
            customizeTooltip: function(e) {
                return {
                    html: $("<div class='tooltip'>").
                        appendTo($("<div>")).
                        text(e.description).
                        parent().html()
                };
            }
        },
        annotations: [
            {
                argument: new Date(2016, 2, 31),
                image: {
                    url: "../../../../images/Charts/Annotation/iphone-se.png"
                },
                description: "The iPhone SE (Special Edition) is a smartphone that was designed and marketed by Apple Inc. It is part of the ninth generation of the iPhone alongside the iPhone 6S. It was announced on March 21, 2016 at the Town Hall auditorium in the Apple Campus by Apple executive Greg Joswiak, with pre-orders beginning on March 24, and official release on March 31, 2016. It was re-released almost a year later on March 24, 2017 with larger storage capacities. The iPhone SE shares the same physical design and dimensions as the iPhone 5S, but has upgraded internal hardware, including the newer Apple A9 system-on-chip, greater battery capacity, and a 12-megapixel rear camera that can record 4K video. Along with the iPhone 6S and the iPhone X, the iPhone SE was discontinued by Apple on September 12, 2018"
            },
            {
                argument: new Date(2017, 10, 3),
                offsetY: 110,
                image: {
                    url: "../../../../images/Charts/Annotation/iphone-x.png"
                },
                description: "iPhone X (Roman numeral 'X' pronounced 'ten') is a smartphone designed, developed, and marketed by Apple Inc. It was the eleventh generation of the iPhone. It was announced on September 12, 2017, alongside the iPhone 8 and iPhone 8 Plus, at the Steve Jobs Theater in the Apple Park campus. The phone was released on November 3, 2017, marking the iPhone series' tenth anniversary"
            },
            {
                argument: new Date(2015, 3, 24),
                paddingTopBottom: 5,
                image: {
                    url: "../../../../images/Charts/Annotation/apple-watch.png"
                },
                description: "Apple Watch is a line of smartwatches designed, developed, and marketed by Apple Inc. It incorporates fitness tracking and health-oriented capabilities with integration with iOS and other Apple products and services. The Apple Watch was released on April 24, 2015 and quickly became the best-selling wearable device with 4.2 million sold in the second quarter of the 2015 fiscal year"
            },
            {
                argument: new Date(2017, 5, 5),
                type: "text",
                text: "WWDC 2017",
                description: "The Apple Worldwide Developers Conference was held from June 5 to June 9, 2017 at the San Jose Convention Center in San Jose, California, which was the first time since 2002 that the conference took place in the city. Software announcements included iOS 11, watchOS 4, macOS High Sierra, and updates to tvOS. Hardware announcements included updates to iMac, MacBook and MacBook Pro, as well as the new iMac Pro, 10.5-inch iPad Pro and smart speaker HomePod. Fall Out Boy performed at the Bash held in Discovery Meadow on June 8"
            },
            {
                argument: new Date(2019, 2, 25),
                type: "text",
                text: "Apple TV+ announced",
                description: "Apple TV+ is an upcoming over-the-top ad-free subscription video on demand web television service announced by Apple Inc. in 2019 during their March 25 Apple Special Event held at Steve Jobs Theater"
            }
        ]
    });
});
