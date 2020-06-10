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
    values: number[];
    tooltip: string;
}

export class FeatureGeometry {
    type: string;
    coordinates: number[];
}

let names: string[] = ["Christian", "Muslim", "Unaffiliated", "Buddhist", "Jewish"];

let markers: FeatureCollection = {
    type: "FeatureCollection",
    features: [{
        coordinates: [34.6, -5.1],
        values: [61.4, 35.2, 1.4, 0, 0],
        country: "Tanzania"
    }, {
        coordinates: [18.8, 15],
        values: [40.6, 55.3, 2.5, 0, 0],
        country: "Chad"
    }, {
        coordinates: [7.36, 9.97],
        values: [49.3, 48.8, 0.4, 0, 0],
        country: "Nigeria"
    }, {
        coordinates: [135.61, -24.57],
        values: [67.3, 2.4, 24.2, 2.7, 0.5],
        country: "Australia"
    }, {
        coordinates: [103.3, 34.85],
        values: [5.1, 1.8, 52.2, 18.2, 0],
        country: "China"
    }, {
        coordinates: [139.5, 37],
        values: [1.6, 0.2, 57, 36.2, 0],
        country: "Japan"
    }, {
        coordinates: [100.8, 15.9],
        values: [0.9, 5.5, 0.3, 93.2, 0],
        country: "Thailand"
    }, {
        coordinates: [10.4, 51.4],
        values: [68.7, 5.8, 24.7, 0.3, 0.3],
        country: "Germany"
    }, {
        coordinates: [100.8, 65.3],
        values: [73.3, 10, 16.2, 0.1, 0.2],
        country: "Russia"
    }, {
        coordinates: [-3.48, 40.36],
        values: [78.6, 2.1, 19, 0, 0.1],
        country: "Spain"
    }, {
        coordinates: [-78.01, 21.72],
        values: [59.2, 0, 23, 0, 0],
        country: "Cuba"
    }, {
        coordinates: [-63.7, -31.92],
        values: [85.2, 1, 12.2, 0.05, 0.5],
        country: "Argentina"
    }, {
        coordinates: [-110.53, 60.78],
        values: [69, 2.1, 23.7, 0.5, 0.3],
        country: "Canada"
    }, {
        coordinates: [-100.1, 40.14],
        values: [78.3, 0.9, 16.4, 1.2, 1.8],
        country: "United States"
    }, {
        coordinates: [34.88, 31.16],
        values: [2, 18.6, 3.1, 0.3, 75.6],
        country: "Israel"
    }].map(function (data) {
        let list = ["<span class='country'>" + data.country + "</span>", "&nbsp;"];
        data.values.forEach(function (value, i) {
            if (value > 0) {
                list.push(names[i] + ": " + value + "%");
            }
        });
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: data.coordinates
            },
            properties: {
                tooltip: list.join("\n"),
                values: data.values
            }
        };
    })
};

@Injectable()
export class Service {
    getMarkers(): FeatureCollection {
        return markers;
    }

    getNames(): string[] {
        return names;
    }
}
