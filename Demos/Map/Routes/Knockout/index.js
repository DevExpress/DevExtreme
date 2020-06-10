window.onload = function() {
    var routes = ko.observableArray([
        {
            weight: 6,
            color: "blue",
            opacity: 0.5,
            mode: "",
            locations: [
                [40.782500, -73.966111],
                [40.755833, -73.986389],
                [40.753889, -73.981389],
                "Brooklyn Bridge,New York,NY"
            ]
        }
    ]);
    
    var viewModel = {
        mapOptions: {
            provider: "bing",
            zoom: 14,
            height: 440,
            width: "100%",
            controls: true,
            markers: [{
                location: "40.7825, -73.966111"
            }, {
                location: [40.755833, -73.986389]
            }, {
                location: { lat: 40.753889, lng: -73.981389}
            }, {
                location: "Brooklyn Bridge,New York,NY"
            }],
            routes: routes
        },
        chooseModeOptions: {
            dataSource: [ "driving", "walking" ],
            value: "driving",
            onValueChanged: function(data) {
                routes([ $.extend({}, routes()[0], {
                    mode: data.value
                })]);
            }
        },
        chooseColorOptions: {
            dataSource: [ "blue", "green", "red" ],
            value: "blue",
            onValueChanged: function (data) {
                routes([ $.extend({}, routes()[0], {
                    color: data.value
                })]);
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("map-demo"));
};