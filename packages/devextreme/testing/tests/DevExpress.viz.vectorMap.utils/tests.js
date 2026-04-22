/* global ROOT_URL */

import { parse } from '../../../artifacts/js/vectormap-utils/dx.vectormaputils.js';
import $ from 'jquery';

const TEST_DATA_URL = ROOT_URL + 'packages/devextreme/testing/content/VectorMapData/';

let testData = [];

function applyDatesPatch(obj, parser) {
    obj.features.forEach(function(feature) {
        feature.properties.Date = parser(feature.properties.Date);
    });
}

function loadBinaryData(url) {
    const $deferred = $.Deferred();
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'arraybuffer';
    request.addEventListener('load', function() {
        if(this.readyState === 4) {
            $deferred.resolve(this.status === 200 ? this.response : null);
        }
    });
    request.send(null);
    return $deferred.promise();
}

function checkErrors(assert, errors, name) {
    if(name === 'Polygon(Polygon_with_null)') {
        assert.equal(errors.length, 1, 'should be one error');
        assert.equal(errors[0], 'shp: shape #2 type: Null / expected: Polygon', 'parsing errors');
    } else {
        assert.strictEqual(errors, null, 'parsing errors');
    }
}

function getFailCallBack(assert) {
    return function(e) {
        e = e || {};
        assert.ok(false, e.responseText);
    };
}

QUnit.module('data loader', {
    before: async function() {
        debugger;
        const response = await fetch('/TestVectorMapData/GetTestData');
        testData = await response.json();

        testData.forEach(function(testDataItem) {
            testDataItem.expected = JSON.parse(testDataItem.expected);

            applyDatesPatch(testDataItem.expected, function(value) {
                const parts = value.split('-');
                return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            });
        });
        if(typeof ArrayBuffer !== 'undefined') {
            QUnit.module('browser - parse ArrayBuffer');

            testData.forEach(function(testDataItem) {
                QUnit.test(testDataItem.name, function(assert) {
                    const done = assert.async();
                    $.when(loadBinaryData(TEST_DATA_URL + testDataItem.name + '.shp'), loadBinaryData(TEST_DATA_URL + testDataItem.name + '.dbf')).then(function(shapeData, dataBaseFileData) {
                        let data;
                        let errors;
                        const func = parse({ 'shp': shapeData, 'dbf': dataBaseFileData }, function(data_, errors_) {
                            data = data_;
                            errors = errors_;
                        });
                        assert.strictEqual(func, data, 'function result');
                        assert.deepEqual(data, testDataItem.expected, 'parsing result');
                        checkErrors(assert, errors, testDataItem.name);
                    }).fail(getFailCallBack(assert))
                        .always(done);
                });
            });

            QUnit.module('browser - load and parse');

            testData.forEach(function(testDataItem) {
                QUnit.test(testDataItem.name, function(assert) {
                    const done = assert.async();
                    const func = parse(TEST_DATA_URL + testDataItem.name, function(data, errors) {
                        assert.strictEqual(func, undefined, 'function result');
                        assert.deepEqual(data, testDataItem.expected, 'parsing result');
                        checkErrors(assert, errors, testDataItem.name);
                        done();
                    });
                });
            });
        }
    },
}, function() {
    QUnit.test('trigger the "before" hook to load an array on which other test cases are based', function(assert) {
        assert.expect(0);
    });
});
