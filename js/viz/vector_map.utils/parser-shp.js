/* eslint-disable no-undef, no-unused-vars*/
function parseShape(stream, errors) {
    let timeStart;
    let timeEnd;
    let header;
    const records = [];
    let record;
    try {
        timeStart = new Date();
        header = parseShapeHeader(stream);
    } catch(e) {
        errors.push('shp: header parsing error: ' + e.message + ' / ' + e.description);
        return;
    }
    if(header.fileCode !== 9994) {
        errors.push('shp: file code: ' + header.fileCode + ' / expected: 9994');
    }
    if(header.version !== 1000) {
        errors.push('shp: file version: ' + header.version + ' / expected: 1000');
    }
    try {
        while(stream.pos() < header.fileLength) {
            record = parseShapeRecord(stream, header.type, errors);
            if(record) {
                records.push(record);
            } else {
                break;
            }
        }
        if(stream.pos() !== header.fileLength) {
            errors.push('shp: file length: ' + header.fileLength + ' / actual: ' + stream.pos());
        }
        timeEnd = new Date();
    } catch(e) {
        errors.push('shp: records parsing error: ' + e.message + ' / ' + e.description);
    }

    return {
        bBox: header.bBox_XY,
        type: header.shapeType,
        shapes: records,
        errors: errors,
        time: timeEnd - timeStart
    };
}

function readPointShape(stream, record) {
    record.coordinates = readPointArray(stream, 1)[0];
}

function readPolyLineShape(stream, record) {
    const bBox = readBBox(stream);
    const numParts = readInteger(stream);
    const numPoints = readInteger(stream);
    const parts = readIntegerArray(stream, numParts);
    const points = readPointArray(stream, numPoints);
    const rings = [];
    let i;
    rings.length = numParts;
    for(i = 0; i < numParts; ++i) {
        rings[i] = points.slice(parts[i], parts[i + 1] || numPoints);
    }
    record.bBox = bBox;
    record.coordinates = rings;
}

function readMultiPointShape(stream, record) {
    record.bBox = readBBox(stream);
    record.coordinates = readPointArray(stream, readInteger(stream));
}

function readPointMShape(stream, record) {
    record.coordinates = readPointArray(stream, 1)[0];
    record.coordinates.push(readDoubleArray(stream, 1)[0]);
}

function readMultiPointMShape(stream, record) {
    const bBox = readBBox(stream);
    const numPoints = readInteger(stream);
    const points = readPointArray(stream, numPoints);
    const mBox = readPair(stream);
    const mValues = readDoubleArray(stream, numPoints);
    record.bBox = bBox;
    record.mBox = mBox;
    record.coordinates = merge_XYM(points, mValues, numPoints);
}

function readPolyLineMShape(stream, record) {
    const bBox = readBBox(stream);
    const numParts = readInteger(stream);
    const numPoints = readInteger(stream);
    const parts = readIntegerArray(stream, numParts);
    const points = readPointArray(stream, numPoints);
    const mBox = readPair(stream);
    const mValues = readDoubleArray(stream, numPoints);
    const rings = [];
    let i;
    let from;
    let to;
    rings.length = numParts;
    for(i = 0; i < numParts; ++i) {
        from = parts[i];
        to = parts[i + 1] || numPoints;
        rings[i] = merge_XYM(points.slice(from, to), mValues.slice(from, to), to - from);
    }
    record.bBox = bBox;
    record.mBox = mBox;
    record.coordinates = rings;
}

function readPointZShape(stream, record) {
    record.coordinates = readPointArray(stream, 1)[0];
    record.push(readDoubleArray(stream, 1)[0], readDoubleArray(stream, 1)[0]);
}

function readMultiPointZShape(stream, record) {
    const bBox = readBBox(stream);
    const numPoints = readInteger(stream);
    const points = readPointArray(stream, numPoints);
    const zBox = readPair(stream);
    const zValues = readDoubleArray(stream, numPoints);
    const mBox = readPair(stream);
    const mValue = readDoubleArray(stream, numPoints);
    record.bBox = bBox;
    record.zBox = zBox;
    record.mBox = mBox;
    record.coordinates = merge_XYZM(points, zValues, mValue, numPoints);
}

function readPolyLineZShape(stream, record) {
    const bBox = readBBox(stream);
    const numParts = readInteger(stream);
    const numPoints = readInteger(stream);
    const parts = readIntegerArray(stream, numParts);
    const points = readPointArray(stream, numPoints);
    const zBox = readPair(stream);
    const zValues = readDoubleArray(stream, numPoints);
    const mBox = readPair(stream);
    const mValues = readDoubleArray(stream, numPoints);
    const rings = [];
    let i;
    let from;
    let to;
    rings.length = numParts;
    for(i = 0; i < numParts; ++i) {
        from = parts[i];
        to = parts[i + 1] || numPoints;
        rings[i] = merge_XYZM(points.slice(from, to), zValues.slice(from, to), mValues.slice(from, to), to - from);
    }
    record.bBox = bBox;
    record.zBox = zBox;
    record.mBox = mBox;
    record.coordinates = rings;
}

function readMultiPatchShape(stream, record) {
    const bBox = readBBox(stream);
    const numParts = readInteger(stream);
    const numPoints = readInteger(stream);
    const parts = readIntegerArray(stream, numParts);
    const partTypes = readIntegerArray(stream, numParts);
    const points = readPointArray(stream, numPoints);
    const zBox = readPair(stream);
    const zValues = readDoubleArray(stream, numPoints);
    const mBox = readPair(stream);
    const rings = [];
    let i;
    let from;
    let to;
    rings.length = numParts;
    for(i = 0; i < numParts; ++i) {
        from = parts[i];
        to = parts[i + 1] || numPoints;
        rings[i] = merge_XYZM(points.slice(from, to), zValues.slice(from, to), mValues.slice(from, to), to - from);
    }
    record.bBox = bBox;
    record.zBox = zBox;
    record.mBox = mBox;
    record.types = partTypes;
    record.coordinates = rings;
}

const SHP_TYPES = {
    0: 'Null',
    1: 'Point',
    3: 'PolyLine',
    5: 'Polygon',
    8: 'MultiPoint',
    11: 'PointZ',
    13: 'PolyLineZ',
    15: 'PolygonZ',
    18: 'MultiPointZ',
    21: 'PointM',
    23: 'PolyLineM',
    25: 'PolygonM',
    28: 'MultiPointM',
    31: 'MultiPatch'
};

const SHP_RECORD_PARSERS = {
    0: noop,
    1: readPointShape,
    3: readPolyLineShape,
    5: readPolyLineShape,
    8: readMultiPointShape,
    11: readPointZShape,
    13: readPolyLineZShape,
    15: readPolyLineZShape,
    18: readMultiPointZShape,
    21: readPointMShape,
    23: readPolyLineMShape,
    25: readPolyLineMShape,
    28: readMultiPointMShape,
    31: readMultiPatchShape
};

const SHP_TYPE_TO_GEOJSON_TYPE_MAP = {
    'Null': 'Null',
    'Point': 'Point',
    'PolyLine': 'MultiLineString',
    'Polygon': 'Polygon',
    'MultiPoint': 'MultiPoint',
    'PointZ': 'Point',
    'PolyLineZ': 'MultiLineString',
    'PolygonZ': 'Polygon',
    'MultiPointZ': 'MultiPoint',
    'PointM': 'Point',
    'PolyLineM': 'MultiLineString',
    'PolygonM': 'Polygon',
    'MultiPointM': 'MultiPoint',
    'MultiPatch': 'MultiPatch'
};

function parseShapeHeader(stream) {
    const header = {};
    header.fileCode = stream.ui32BE();
    stream.skip(20);
    header.fileLength = stream.ui32BE() << 1;
    header.version = stream.ui32LE();
    header.type_number = stream.ui32LE();
    header.type = SHP_TYPES[header.type_number];
    header.bBox_XY = readBBox(stream);
    header.bBox_ZM = readPointArray(stream, 2);
    return header;
}

function readInteger(stream) {
    return stream.ui32LE();
}

function readIntegerArray(stream, length) {
    const array = [];
    let i;
    array.length = length;
    for(i = 0; i < length; ++i) {
        array[i] = readInteger(stream);
    }
    return array;
}

function readDoubleArray(stream, length) {
    const array = [];
    let i;
    array.length = length;
    for(i = 0; i < length; ++i) {
        array[i] = stream.f64LE();
    }
    return array;
}

function readBBox(stream) {
    return readDoubleArray(stream, 4);
}

function readPair(stream) {
    return [stream.f64LE(), stream.f64LE()];
}

function readPointArray(stream, count) {
    const points = [];
    let i;
    points.length = count;
    for(i = 0; i < count; ++i) {
        points[i] = readPair(stream);
    }
    return points;
}

function merge_XYM(xy, m, length) {
    const array = [];
    let i;
    array.length = length;
    for(i = 0; i < length; ++i) {
        array[i] = [xy[i][0], xy[i][1], m[i]];
    }
    return array;
}

function merge_XYZM(xy, z, m, length) {
    const array = [];
    let i;
    array.length = length;
    for(i = 0; i < length; ++i) {
        array[i] = [xy[i][0], xy[i][1], z[i], m[i]];
    }
    return array;
}

function parseShapeRecord(stream, generalType, errors) {
    let record = { number: stream.ui32BE() };
    const length = stream.ui32BE() << 1;
    let pos = stream.pos();
    const type = stream.ui32LE();

    record.type_number = type;
    record.type = SHP_TYPES[type];
    record.geoJSON_type = SHP_TYPE_TO_GEOJSON_TYPE_MAP[record.type];
    if(record.type) {
        if(record.type !== generalType) {
            errors.push('shp: shape #' + record.number + ' type: ' + record.type + ' / expected: ' + generalType);
        }
        SHP_RECORD_PARSERS[type](stream, record);
        pos = stream.pos() - pos;
        if(pos !== length) {
            errors.push('shp: shape #' + record.number + ' length: ' + length + ' / actual: ' + pos);
        }
    } else {
        errors.push('shp: shape #' + record.number + ' type: ' + type + ' / unknown');
        record = null;
    }
    return record;
}
