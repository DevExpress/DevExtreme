/* eslint-disable no-unused-vars, no-var, one-var*/
function parseDBF(stream, errors) {
    let timeStart;
    let timeEnd;
    let header;
    let parseData;
    let records;
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
    let i;
    const header = {
        versionNumber: stream.ui8(),
        lastUpdate: new Date(1900 + stream.ui8(), stream.ui8() - 1, stream.ui8()),
        numberOfRecords: stream.ui32LE(),
        headerLength: stream.ui16LE(),
        recordLength: stream.ui16LE(),
        fields: []
    };
    let term;
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

const _fromCharCode = String.fromCharCode;

function getAsciiString(stream, length) {
    return _fromCharCode.apply(null, stream.ui8arr(length));
}

function parseFieldDescriptor(stream) {
    const desc = {
        name: getAsciiString(stream, 11).replace(/\0*$/gi, ''),
        type: _fromCharCode(stream.ui8()),
        length: stream.skip(4).ui8(),
        count: stream.ui8()
    };
    stream.skip(14);
    return desc;
}

const DBF_FIELD_PARSERS = {
    'C': function(stream, length) {
        let str = getAsciiString(stream, length);

        try {
            str = decodeURIComponent(escape(str)); // T522922
        } catch(e) { }

        return str.trim();
    },
    'N': function(stream, length) {
        const str = getAsciiString(stream, length);
        return parseFloat(str, 10);
    },
    'D': function(stream, length) {
        const str = getAsciiString(stream, length);
        return new Date(str.substring(0, 4), str.substring(4, 6) - 1, str.substring(6, 8));
    }
};

function DBF_FIELD_PARSER_DEFAULT(stream, length) {
    stream.skip(length);
    return null;
}

function prepareDataBaseFileRecordParseData(header, errors) {
    const list = [];
    let i = 0;
    const ii = header.fields.length;
    let item; let field;
    let totalLength = 0;
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
    let i;
    let j;
    const jj = parseData.length;
    let pos;
    const records = [];
    let record;
    let pd;
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
