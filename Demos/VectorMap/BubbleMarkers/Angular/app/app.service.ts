import { Injectable } from '@angular/core';

export class FeatureCollection {
    type: string;
    features: Feature[];
}

export class Feature {
    type: string;
    properties: FeatureProperty;
    geometry: FeatureGeometry;
}

export class FeatureProperty {
    text: string;
    value: number;
    tooltip: string;
}

export class FeatureGeometry {
    type: string;
    coordinates: number[];
}

let markers: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            coordinates: [-74, 40.7],
            text: "New York City",
            value: 8406
        },
        {
            coordinates: [100.47, 13.75],
            text: "Bangkok",
            value: 8281
        },
        {
            coordinates: [44.43, 33.33],
            text: "Baghdad",
            value: 7181
        },
        {
            coordinates: [37.62, 55.75],
            text: "Moscow",
            value: 12111
        },
        {
            coordinates: [121.5, 31.2],
            text: "Shanghai",
            value: 24150
        },
        {
            coordinates: [-43.18, -22.9],
            text: "Rio de Janeiro",
            value: 6429
        },
        {
            coordinates: [31.23, 30.05],
            text: "Cairo",
            value: 8922
        },
        {
            coordinates: [28.95, 41],
            text: "Istanbul",
            value: 14160
        },
        {
            coordinates: [127, 37.55],
            text: "Seoul",
            value: 10388
        },
        {
            coordinates: [139.68, 35.68],
            text: "Tokyo",
            value: 9071
        },
        {
            coordinates: [103.83, 1.28],
            text: "Singapore",
            value: 5399
        },
        {
            coordinates: [30.3, 59.95],
            text: "Saint Petersburg",
            value: 5131
        },
        {
            coordinates: [28.03, -26.2],
            text: "Johannesburg",
            value: 4434
        },
        {
            coordinates: [144.95, -37.8],
            text: "Melbourne",
            value: 4252
        }
    ].map(function (data) {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: data.coordinates
            },
            properties: {
                text: data.text,
                value: data.value,
                tooltip: "<b>" + data.text + "</b>\n" + data.value + "K"
            }
        }
    })
};

@Injectable()
export class Service {
    getMarkers(): FeatureCollection {
        return markers;
    }
}
