$(function(){
    var markerUrl = "https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png",
        markersData = [{
                location: [40.755833, -73.986389],
                tooltip: {
                    text: "Times Square"
                }
            }, {
                location: "40.7825, -73.966111",
                tooltip: {
                    text: "Central Park"
                }
            }, {
                location: { lat: 40.753889, lng: -73.981389},
                tooltip: {
                    text: "Fifth Avenue"
                }
            }, {
                location: "Brooklyn Bridge,New York,NY",
                tooltip: {
                    text: "Brooklyn Bridge"
                }
            }
        ];
    
    var mapWidget = $("#map").dxMap({
        provider: "bing",
        zoom: 11,
        height: 440,
        width: "100%",
        controls: true,
        markerIconSrc: markerUrl,
        markers: markersData
    }).dxMap("instance");
    
    $("#use-custom-markers").dxCheckBox({
        value: true,
        text: "Use custom marker icons",
        onValueChanged: function(data) {
            mapWidget.option("markers", markersData);
            mapWidget.option("markerIconSrc", data.value ? markerUrl : null);
        }
    });
    
    $("#show-tooltips").dxButton({
        text: "Show all tooltips",
        onClick: function() {
            var newMarkers = $.map(markersData, function(item) {
                return $.extend(true, {}, item, { tooltip: { isShown: true }} );
            });
    
            mapWidget.option("markers", newMarkers);
        }
    });
});