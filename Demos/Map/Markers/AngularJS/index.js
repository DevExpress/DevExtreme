var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
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
    
    $scope.markerUrlValue = markerUrl;
    $scope.markers = markersData;
        
    $scope.mapOptions = {
        provider: "bing",
        zoom: 11,
        height: 440,
        width: "100%",
        controls: true,
        bindingOptions: {
            markerIconSrc: "markerUrlValue",
            markers: "markers"
        }
    };
    
    $scope.useCustomMarkersOptions = {
        value: true,
        text: "Use custom marker icons",
        onValueChanged: function(data) {
            $scope.markers = markersData;
            $scope.markerUrlValue = data.value ? markerUrl : null;
        }
    };
    
    $scope.showTooltipsOptions = {
        text: "Show all tooltips",
        onClick: function() {
            $scope.markers = $scope.markers.map(function(item) {
                return $.extend(true, {}, item, { tooltip: { isShown: true } });
            });
        }
    };
});