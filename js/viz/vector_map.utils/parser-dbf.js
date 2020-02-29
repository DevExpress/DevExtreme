/* eslint-disable no-unused-vars, no-var, one-var*/
function parseDBF(stream, errors) {
    var timeStart;
    var timeEnd;
    var header;
    var parseData;
    var records;
    try {
        timeStart = new Date();
        header = parseDataBaseFileHeader(stream, errors);
        parseData = prepareDataBaseFileRecordParseData(header, errors);
        records = parseDataBaseFileRecords(stream, header.numberOfRecords, header.recordLength, parseData, errors);
        timeEnd = new Date();
    } catch(e) {
        errors.push('dbf: parsing error: ' + e.message + ' / ' + e.description);
    }
    return { records: records, errors: errors, time: timeEnd - timeStart };
}

function parseDataBaseFileHeader(stream, errors) {
    var i;
    var header = {
        versionNumber: stream.ui8(),
        lastUpdate: new Date(1900 + stream.ui8(), stream.ui8() - 1, stream.ui8()),
        numberOfRecords: stream.ui32LE(),
        headerLength: stream.ui16LE(),
        recordLength: stream.ui16LE(),
        fields: []
    };
    var term;
    stream.skip(20);
    for(i = (header.headerLength - stream.pos() - 1) / 32; i > 0; --i) {
        header.fields.push(parseFieldDescriptor(stream));
    }
    term = stream.ui8();
    if(term !== 13) {
        errors.push('dbf: header terminator: ' + term + ' / expected: 13');
    }
    return header;
}

var _fromCharCode = String.fromCharCode;

function getAsciiString(stream, length) {
    return _fromCharCode.apply(null, stream.ui8arr(length));
}

function parseFieldDescriptor(stream) {
    var desc = {
        name: getAsciiString(stream, 11).replace(/\0*$/gi, ''),
        type: _fromCharCode(stream.ui8()),
        length: stream.skip(4).ui8(),
        count: stream.ui8()
    };
    stream.skip(14);
    return desc;
}

var DBF_FIELD_PARSERS = {
    'C': function(stream, length) {
        var str = getAsciiString(stream, length);

        try {
            str = decodeURIComponent(escape(str)); // T522922
        } catch(e) { }

        return str.trim();
    },
    'N': function(stream, length) {
        var str = getAsciiString(stream, length);
        return parseFloat(str, 10);
    },
    'D': function(stream, length) {
        var str = getAsciiString(stream, length);
        return new Date(str.substring(0, 4), str.substring(4, 6) - 1, str.substring(6, 8));
    }
};

function DBF_FIELD_PARSER_DEFAULT(stream, length) {
    stream.skip(length);
    return null;
}

function prepareDataBaseFileRecordParseData(header, errors) {
    var list = [];
    var i = 0;
    var ii = header.fields.length;
    var item;
    var field;
    var totalLength = 0;
    for(i = 0; i < ii; ++i) {
        field = header.fields[i];
        item = {
            name: field.name,
            parser: DBF_FIELD_PARSERS[field.type],
            length: field.length
        };
        if(!item.parser) {
            item.parser = DBF_FIELD_PARSER_DEFAULT;
            errors.push('dbf: field ' + field.name + ' type: ' + field.type + ' / unknown');
        }
        totalLength += field.length;
        list.push(item);
    }
    if(totalLength + 1 !== header.recordLength) {
        errors.push('dbf: record length: ' + header.recordLength + ' / actual: ' + (totalLength + 1));
    }
    return list;
}

function parseDataBaseFileRecords(stream, recordCount, recordLength, parseData, errors) {
    var i;
    var j;
    var jj = parseData.length;
    var pos;
    var records = [];
    var record;
    var pd;
    for(i = 0; i < recordCount; ++i) {
        record = {};
        pos = stream.pos();
        stream.skip(1);
        for(j = 0; j < jj; ++j) {
            pd = parseData[j];
            record[pd.name] = pd.parser(stream, pd.length);
        }
        pos = stream.pos() - pos;
        if(pos !== recordLength) {
            errors.push('dbf: record #' + (i + 1) + ' length: ' + recordLength + ' / actual: ' + pos);
        }
        records.push(record);
    }
    return records;
}
