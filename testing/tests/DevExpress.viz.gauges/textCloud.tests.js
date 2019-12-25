var $ = require('jquery'),
    getTextCloudInfo = require('viz/gauges/base_indicators').getTextCloudInfo;

var data = {
    'right-bottom': {
        cx: 355,
        cy: 150,
        points: [
            400,
            300,
            400,
            120,
            310,
            120,
            310,
            180,
            370,
            180
        ]
    },
    'bottom-right': {
        cx: 235,
        cy: 270,
        points: [
            400,
            300,
            190,
            300,
            190,
            240,
            280,
            240,
            280,
            280
        ]
    },
    'left-bottom': {
        cx: 445,
        cy: 150,
        points: [
            400,
            300,
            400,
            120,
            490,
            120,
            490,
            180,
            430,
            180
        ]
    },
    'bottom-left': {
        cx: 565,
        cy: 270,
        points: [
            400,
            300,
            610,
            300,
            610,
            240,
            520,
            240,
            520,
            280
        ]
    },
    'right-top': {
        cx: 355,
        cy: 450,
        points: [
            400,
            300,
            400,
            480,
            310,
            480,
            310,
            420,
            370,
            420
        ]
    },
    'top-right': {
        cx: 235,
        cy: 330,
        points: [
            400,
            300,
            190,
            300,
            190,
            360,
            280,
            360,
            280,
            320
        ]
    },
    'left-top': {
        cx: 445,
        cy: 450,
        points: [
            400,
            300,
            400,
            480,
            490,
            480,
            490,
            420,
            430,
            420
        ]
    },
    'top-left': {
        cx: 565,
        cy: 330,
        points: [
            400,
            300,
            610,
            300,
            610,
            360,
            520,
            360,
            520,
            320
        ]
    }
};

QUnit.module('Text cloud info');

$.each(data, function(type, expected) {
    QUnit.test(type, function(assert) {
        assert.deepEqual(getTextCloudInfo({
            x: 400,
            y: 300,
            tailLength: 120,
            textWidth: 74,
            textHeight: 48,
            horMargin: 8,
            verMargin: 6,
            type: type
        }), expected);
    });
});
