function getImageUrl(name) {
    return "../../../../images/" + name + ".png";
}

var weatherData = {
    type: "FeatureCollection",
    features: [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-74.007118, 40.71455]
        },
        "properties": {
            "url": getImageUrl("Storm"),
            "text": "New York"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-77.016251, 38.904758]
        },
        "properties": {
            "url": getImageUrl("Cloudy"),
            "text": "Washington"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-81.674782, 30.332251]
        },
        "properties": {
            "url": getImageUrl("Storm"),
            "text": "Jacksonville"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-84.423058, 33.763191]
        },
        "properties": {
            "url": getImageUrl("Rain"),
            "text": "Atlanta"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-97.514839, 35.466179]
        },
        "properties": {
            "url": getImageUrl("PartlyCloudy"),
            "text": "Oklahoma City"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-87.632408, 41.884151]
        },
        "properties": {
            "url": getImageUrl("Rain"),
            "text": "Chicago"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-93.103882, 44.947769]
        },
        "properties": {
            "url": getImageUrl("PartlyCloudy"),
            "text": "St. Paul"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-94.626823, 39.113522]
        },
        "properties": {
            "url": getImageUrl("Cloudy"),
            "text": "Kansas City"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-95.381889, 29.775419]
        },
        "properties": {
            "url": getImageUrl("Sunny"),
            "text": "Houston"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-104.991997, 39.740002]
        },
        "properties": {
            "url": getImageUrl("PartlyCloudy"),
            "text": "Denver"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-116.193413, 43.606979]
        },
        "properties": {
            "url": getImageUrl("Sunny"),
            "text": "Boise"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-118.245003, 34.053501]
        },
        "properties": {
            "url": getImageUrl("PartlyCloudy"),
            "text": "Los Angeles"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-121.886002, 37.3386]
        },
        "properties": {
            "url": getImageUrl("PartlyCloudy"),
            "text": "San Jose"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-123.0252, 44.923199]
        },
        "properties": {
            "url": getImageUrl("Sunny"),
            "text": "Salem"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.329437, 47.603561]
        },
        "properties": {
            "url": getImageUrl("Sunny"),
            "text": "Seattle"
        }
    }]
};