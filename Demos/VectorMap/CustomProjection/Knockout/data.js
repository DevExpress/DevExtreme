var coordLinesData = {
    type: "FeatureCollection",
    features: []
};

var longitude;
var latitude;

//add meridians
for (longitude = -180; longitude <= 180; longitude += 30) {
    var lineCoords = [];
    for (latitude = -90; latitude <= 90; latitude += 5) {
        lineCoords.push([longitude, latitude]);
    }

    coordLinesData.features.push({
        geometry: {
            type: "LineString",
            coordinates: lineCoords
        }
    });
}

//add parallels
for (latitude = -90; latitude <= 90; latitude += 30) {
    coordLinesData.features.push({
        geometry: {
            type: "LineString",
            coordinates: [[ -180, latitude ], [ 180, latitude]]
        }
    });
}