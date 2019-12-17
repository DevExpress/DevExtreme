/* eslint-disable no-undef*/

function noop() { }

function eigen(x) { return x; }

function isFunction(target) {
    return typeof target === 'function';
}

function wrapSource(source) {
    const buffer = wrapBuffer(source);
    let position = 0;
    let stream;

    stream = {
        pos: function() {
            return position;
        },

        skip: function(count) {
            position += count;
            return stream;
        },

        ui8arr: function(length) {
            let i = 0;
            const list = [];
            list.length = length;
            for(; i < length; ++i) {
                list[i] = stream.ui8();
            }
            return list;
        },

        ui8: function() {
            const val = ui8(buffer, position);
            position += 1;
            return val;
        },

        ui16LE: function() {
            const val = ui16LE(buffer, position);
            position += 2;
            return val;
        },

        ui32LE: function() {
            const val = ui32LE(buffer, position);
            position += 4;
            return val;
        },

        ui32BE: function() {
            const val = ui32BE(buffer, position);
            position += 4;
            return val;
        },

        f64LE: function() {
            const val = f64LE(buffer, position);
            position += 8;
            return val;
        }
    };
    return stream;
}

function parseCore(source, roundCoordinates, errors) {
    const shapeData = source[0] ? parseShape(wrapSource(source[0]), errors) : {};
    const dataBaseFileData = source[1] ? parseDBF(wrapSource(source[1]), errors) : {};
    const features = buildFeatures(shapeData.shapes || [], dataBaseFileData.records || [], roundCoordinates);
    let result;

    if(features.length) {
        result = {
            type: 'FeatureCollection',
            features: features
        };
        result['bbox'] = shapeData.bBox;
    } else {
        result = null;
    }
    return result;
}

function buildFeatures(shapeData, dataBaseFileData, roundCoordinates) {
    const features = [];
    let i;
    var ii = features.length = ii = Math.max(shapeData.length, dataBaseFileData.length);
    let shape;
    for(i = 0; i < ii; ++i) {
        shape = shapeData[i] || {};
        features[i] = {
            type: 'Feature',
            geometry: {
                type: shape.geoJSON_type || null,
                coordinates: shape.coordinates ? roundCoordinates(shape.coordinates) : []
            },
            properties: dataBaseFileData[i] || null
        };
    }
    return features;
}

function createCoordinatesRounder(precision) {
    const factor = Number('1E' + precision);
    function round(x) {
        return Math.round(x * factor) / factor;
    }
    function process(values) {
        return values.map(values[0].length ? process : round);
    }
    return process;
}

function buildParseArgs(source) {
    source = source || {};
    return ['shp', 'dbf'].map(function(key) {
        return function(done) {
            if(source.substr) {
                key = '.' + key;
                sendRequest(source + (source.substr(-key.length).toLowerCase() === key ? '' : key), function(e, response) {
                    done(e, response);
                });
            } else {
                done(null, source[key] || null);
            }
        };
    });
}

function parse(source, parameters, callback) {
    let result;
    when(buildParseArgs(source), function(errorArray, dataArray) {
        callback = (isFunction(parameters) && parameters) || (isFunction(callback) && callback) || noop;
        parameters = (!isFunction(parameters) && parameters) || {};
        const errors = [];
        errorArray.forEach(function(e) {
            e && errors.push(e);
        });
        result = parseCore(dataArray, parameters.precision >= 0 ? createCoordinatesRounder(parameters.precision) : eigen, errors);
        // NOTE: The order of the error and the result is reversed because of backward compatibility
        callback(result, errors.length ? errors : null);
    });
    return result;
}

exports.parse = parse;

function when(actions, callback) {
    const errorArray = [];
    const dataArray = [];
    let counter = 1;
    let lock = true;
    actions.forEach(function(action, i) {
        ++counter;
        action(function(e, data) {
            errorArray[i] = e;
            dataArray[i] = data;
            massDone();
        });
    });
    lock = false;
    massDone();
    function massDone() {
        --counter;
        if(counter === 0 && !lock) {
            callback(errorArray, dataArray);
        }
    }
}
