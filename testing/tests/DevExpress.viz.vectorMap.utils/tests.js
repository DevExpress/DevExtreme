/* global ROOT_URL */

import { parse } from '../../../artifacts/js/vectormap-utils/dx.vectormaputils.js';
import $ from 'jquery';

const CONTROLLER_URL = ROOT_URL + 'TestVectorMapData/';
const TEST_DATA_URL = ROOT_URL + 'testing/content/VectorMapData/';

import data from '../../../TestVectorMapData/GetTestData!text';

const testData = JSON.parse(data);

testData.forEach(function(testDataItem) {
    testDataItem.expected = JSON.parse(testDataItem.expected);
    applyDatesPatch(testDataItem.expected, function(value) {
        const parts = value.split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    });
});

function getFailCallBack(assert) {
    return function(e) {
        e = e || {};
        assert.ok(false, e.responseText);
    };
}

if(typeof ArrayBuffer !== 'undefined') {

    QUnit.module('browser - parse ArrayBuffer');

    testData.forEach(function(testDataItem) {
        QUnit.test(testDataItem.name, function(assert) {
            const done = assert.async();
            $.when(loadBinaryData(TEST_DATA_URL + testDataItem.name + '.shp'), loadBinaryData(TEST_DATA_URL + testDataItem.name + '.dbf')).then(function(shapeData, dataBaseFileData) {
                let func;
                let data;
                let errors;
                func = parse({ 'shp': shapeData, 'dbf': dataBaseFileData }, function(data_, errors_) {
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
            let func;
            func = parse(TEST_DATA_URL + testDataItem.name, function(data, errors) {
                assert.strictEqual(func, undefined, 'function result');
                assert.deepEqual(data, testDataItem.expected, 'parsing result');
                checkErrors(assert, errors, testDataItem.name);
                done();
            });
        });
    });

}

QUnit.module('node - parse Buffer');

testData.forEach(function(testDataItem) {
    QUnit.test(testDataItem.name, function(assert) {
        const done = assert.async();
        $.getJSON(CONTROLLER_URL + 'ParseBuffer/' + testDataItem.name).done(function(response) {
            applyNodeDatesPatch(response.data);
            assert.strictEqual(response.func, true, 'function result');
            assert.deepEqual(response.data, testDataItem.expected, 'parsing result');
            checkErrors(assert, response.errors, testDataItem.name);
        }).fail(getFailCallBack(assert))
            .always(done);
    });
});

QUnit.module('node - read and parse');

testData.forEach(function(testDataItem) {
    QUnit.test(testDataItem.name, function(assert) {
        const done = assert.async();
        $.getJSON(CONTROLLER_URL + 'ReadAndParse/' + testDataItem.name).done(function(response) {
            applyNodeDatesPatch(response.data);
            assert.strictEqual(response.func, true, 'function result');
            assert.deepEqual(response.data, testDataItem.expected, 'parsing result');
            checkErrors(assert, response.errors, testDataItem.name);
        }).fail(getFailCallBack(assert))
            .always(done);
    });
});

QUnit.module('node-console');

function isPoint(obj) {
    return obj.name === 'Point';
}

QUnit.test('process single file', function(assert) {
    const done = assert.async();
    $.getJSON(CONTROLLER_URL + 'ExecuteConsoleApp', { file: 'Point.shp' }, function(response) {
        assert.strictEqual(response.length, 1, 'count');
        applyNodeDatesPatch(response[0].content);
        assert.strictEqual(response[0].file, 'test_Point.js', 'file');
        assert.strictEqual(response[0].variable, 'test.namespace.Point', 'variable');
        assert.deepEqual(response[0].content, $.grep(testData, isPoint)[0].expected, 'content');
    }).fail(getFailCallBack(assert))
        .always(done);
});

QUnit.test('process directory', function(assert) {
    const done = assert.async();
    $.getJSON(CONTROLLER_URL + 'ExecuteConsoleApp', function(response) {
        assert.strictEqual(response.length, testData.length, 'count');
        response.forEach(function(responseItem) {
            const testDataItem = $.grep(testData, function(obj) { return obj.name === responseItem.file.substr(5).replace('.js', ''); })[0];
            assert.strictEqual(responseItem.variable, 'test.namespace.' + testDataItem.name, 'variable /' + testDataItem.name);
            applyNodeDatesPatch(responseItem.content);
            assert.deepEqual(responseItem.content, testDataItem.expected, 'content / ' + testDataItem.name);
        });
    }).fail(getFailCallBack(assert))
        .always(done);
});

QUnit.test('process single file / json', function(assert) {
    const done = assert.async();
    $.getJSON(CONTROLLER_URL + 'ExecuteConsoleApp', { file: 'Point.shp', json: true }, function(response) {
        assert.strictEqual(response.length, 1, 'count');
        applyNodeDatesPatch(response[0].content);
        assert.strictEqual(response[0].file, 'test_Point.json', 'file');
        assert.deepEqual(response[0].content, $.grep(testData, isPoint)[0].expected, 'content');
    }).fail(getFailCallBack(assert))
        .always(done);
});

QUnit.test('process directory / json', function(assert) {
    const done = assert.async();
    $.getJSON(CONTROLLER_URL + 'ExecuteConsoleApp', { json: 1 }, function(response) {
        assert.strictEqual(response.length, testData.length, 'count');
        response.forEach(function(responseItem) {
            const testDataItem = $.grep(testData, function(obj) { return obj.name === responseItem.file.substr(5).replace('.json', ''); })[0];
            applyNodeDatesPatch(responseItem.content);
            assert.deepEqual(responseItem.content, testDataItem.expected, 'content / ' + testDataItem.name);
        });
    }).fail(getFailCallBack(assert))
        .always(done);
});

function applyDatesPatch(obj, parser) {
    obj.features.forEach(function(feature) {
        feature.properties.Date = parser(feature.properties.Date);
    });
}

function applyNodeDatesPatch(obj) {
    applyDatesPatch(obj, function(value) {
        const offset = (new Date(value)).getTimezoneOffset();
        const vals = value.split('T')[0].split('-');
        return new Date(Number(vals[0]), Number(vals[1]) - 1, Number(vals[2]) + (offset < 0 ? 1 : 0));
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
