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
    value: number;
    text: string;
}

export class FeatureGeometry {
    type: string;
    coordinates: number[];
}

let populations: Object = {
    "China": 19,
    "India": 17.4,
    "United States": 4.44,
    "Indonesia": 3.45,
    "Brazil": 2.83,
    "Nigeria": 2.42,
    "Bangladesh": 2.18,
    "Russia": 2.04,
    "Japan": 1.77,
    "Mexico": 1.67,
    "Philippines": 1.39,
    "Vietnam": 1.25,
    "Ethiopia": 1.23,
    "Egypt": 1.21,
    "Germany": 1.13,
    "Turkey": 1.07,
    "Democratic Republic of the Congo": 0.94,
    "France": 0.92,
    "Thailand": 0.9,
    "United Kingdom": 0.89,
    "Italy": 0.85,
    "Burma": 0.84,
    "South Africa": 0.74,
    "South Korea": 0.7,
    "Colombia": 0.66,
    "Spain": 0.65,
    "Tanzania": 0.63,
    "Kenya": 0.62,
    "Ukraine": 0.6,
    "Argentina": 0.59,
    "Algeria": 0.54,
    "Poland": 0.54,
    "Sudan": 0.52,
    "Canada": 0.49,
    "Uganda": 0.49,
    "Morocco": 0.46,
    "Uzbekistan": 0.43
};

let markers: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            coordinates: [-74, 40.7],
            text: 'New York City',
            value: 8406
        },
        {
            coordinates: [100.47, 13.75],
            text: 'Bangkok',
            value: 8281
        },
        {
            coordinates: [37.62, 55.75],
            text: 'Moscow',
            value: 12111
        },
        {
            coordinates: [121.5, 31.2],
            text: 'Shanghai',
            value: 24150
        },
        {
            coordinates: [-43.18, -22.9],
            text: 'Rio de Janeiro',
            value: 6429
        },
        {
            coordinates: [31.23, 30.05],
            text: 'Cairo',
            value: 8922
        },
        {
            coordinates: [28.95, 41],
            text: 'Istanbul',
            value: 14160
        },
        {
            coordinates: [127, 37.55],
            text: 'Seoul',
            value: 10388
        },
        {
            coordinates: [139.68, 35.68],
            text: 'Tokyo',
            value: 9071
        },
        {
            coordinates: [103.83, 1.28],
            text: 'Singapore',
            value: 5399
        },
        {
            coordinates: [30.3, 59.95],
            text: 'Saint Petersburg',
            value: 5131
        },
        {
            coordinates: [28.03, -26.2],
            text: 'Johannesburg',
            value: 4434
        },
        {
            coordinates: [144.95, -37.8],
            text: 'Melbourne',
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
                value: data.value,
                text: data.text
            }
        };
    })
};



@Injectable()
export class Service {
    getPopulations(): Object {
        return populations;
    }

    getMarkers(): FeatureCollection {
        return markers;
    }
}
