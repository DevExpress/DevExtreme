import { Injectable } from '@angular/core';

export class Tooltip {
    isShown: boolean;
    text: string;
}

export class Marker {
    location: any;
    tooltip: Tooltip;
}

let markerUrl = "https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png";

let markers: Marker[] = [{
    location: [40.755833, -73.986389],
    tooltip: {
        isShown: false,
        text: "Times Square"
    }
}, {
    location: "40.7825, -73.966111",
    tooltip: {
        isShown: false,
        text: "Central Park"
    }
}, {
    location: {
        lat: 40.753889,
        lng: -73.981389
    },
    tooltip: {
        isShown: false,
        text: "Fifth Avenue"
    }
}, {
    location: "Brooklyn Bridge,New York,NY",
    tooltip: {
        isShown: false,
        text: "Brooklyn Bridge"
    }
}];

@Injectable()
export class Service {
    getMarkerUrl() : string {
        return markerUrl;
    }
    getMarkers() : Marker[] {
        return markers;
    }
}
