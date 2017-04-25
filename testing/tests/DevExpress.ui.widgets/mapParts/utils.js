"use strict";

var $ = require("jquery");

require("../../../../node_modules/jquery-mockjax/dist/jquery.mockjax.js");

exports.prepare = function() {
    $.mockjaxSettings = $.extend($.mockjaxSettings, {
        responseTime: 0,
        isTimeout: false,
        lastModified: 'Wed, 15 Nov 1995 04:58:08 GMT',
        etag: '686897696a7c876b7e',
    });
};
exports.LOCATIONS = [
    "Brooklyn Bridge,New York,NY",
    { lat: 40.537102, lng: -73.990318 },
    [40.539102, -73.970318],
    "40.557102, -72.990318"
];
exports.MARKERS = [
    {
        tooltip: {
            text: "A",
            isShown: true
        },
        location: { lat: 40.537102, lng: -73.990318 }
    },
    {
        tooltip: "B",
        location: [40.537102, -73.990318]
    },
    {
        tooltip: "C",
        location: "35.537102, -73.990318"
    },
    {
        tooltip: "D",
        location: "Brooklyn Bridge,New York,NY"
    },
    {
        tooltip: "E",
        location: "Moscow, Russia"
    },
    {
        location: { lat: 40.537102, lng: -73.990318 },
        html: "<h1>I am a marker</h1>"
    },
    {
        location: { lat: 40.537102, lng: -73.990318 },
        html: "<h1>I am a marker</h1>",
        htmlOffset: {
            top: 15,
            left: 25
        }
    }
];
exports.ROUTES = [
    {
        weight: 5,
        color: "blue",
        opacity: 0.75,
        mode: "walking",
        locations: [
            [40.737102, -73.990318],
            [40.749825, -73.987963],
            [40.752946, -73.987384]
        ]
    },
    {
        weight: 5,
        color: "blue",
        opacity: 0.5,
        locations: [
            { lat: 40.749825, lng: -73.987963 },
            { lat: 40.752946, lng: -73.987384 },
            [40.755823, -73.986397]
        ]
    },
    {
        weight: 3,
        color: "red",
        opacity: 0.3,
        locations: [
            "Brooklyn Bridge,New York,NY",
            "Edison Bridge, Fort Myers, Florida"
        ]
    }
];
