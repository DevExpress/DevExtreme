var VERSION = require('../core/version'),
    window = require('../core/utils/window').getWindow(),
    imageCreator = require('./image_creator').imageCreator,
    isFunction = require('../core/utils/type').isFunction,
    extend = require('../core/utils/extend').extend,
    deferredUtils = require('../core/utils/deferred'),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,

    mainPageTemplate = '%PDF-1.3\r\n2 0 obj\r\n<</ProcSet[/PDF/ImageB/ImageC/ImageI]/XObject<</I0 5 0 R>>>>\r\nendobj\r\n4 0 obj\r\n<</Type/Pages/Kids[1 0 R]/Count 1>>\r\nendobj\r\n7 0 obj\r\n<</OpenAction[1 0 R /FitH null]/Type/Catalog/Pages 4 0 R/PageLayout/OneColumn>>\r\nendobj\r\n1 0 obj\r\n<</Type/Page/Resources 2 0 R/MediaBox[0 0 _width_ _height_]/Contents 3 0 R/Parent 4 0 R>>\r\nendobj\r\n',
    contentTemplate = '3 0 obj\r\n<</Length 52>>stream\r\n0.20 w\n0 G\nq _width_ 0 0 _height_ 0.00 0.00 cm /I0 Do Q\r\nendstream\r\nendobj\r\n',
    infoTemplate = '6 0 obj\r\n<</CreationDate _date_/Producer(DevExtreme _version_)>>\r\nendobj\r\n',
    imageStartTemplate = '5 0 obj\r\n<</Type/XObject/Subtype/Image/Width _width_/Height _height_/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length _length_>>stream\r\n',
    imageEndTemplate = '\r\nendstream\r\nendobj\r\n',
    trailerTemplate = 'trailer\r\n<<\r\n/Size 8\r\n/Root 7 0 R\r\n/Info 6 0 R\r\n>>\r\nstartxref\r\n_length_\r\n%%EOF',
    xrefTemplate = 'xref\r\n0 8\r\n0000000000 65535 f\r\n0000000241 00000 n\r\n0000000010 00000 n\r\n_main_ 00000 n\r\n0000000089 00000 n\r\n_image_ 00000 n\r\n_info_ 00000 n\r\n0000000143 00000 n\r\n';

var pad = function(str, len) {
    return str.length < len ? pad('0' + str, len) : str;
};

var composePdfString = function(imageString, options, curDate) {
    var margin = (options.margin || 0) * 2,
        width = options.width + margin,
        height = options.height + margin,
        widthPt = (width * 0.75).toFixed(2),
        heightPt = (height * 0.75).toFixed(2);

    var mainPage = mainPageTemplate.replace('_width_', widthPt).replace('_height_', heightPt),
        content = contentTemplate.replace('_width_', widthPt).replace('_height_', heightPt),
        info = infoTemplate.replace('_date_', curDate).replace('_version_', VERSION),
        image = imageStartTemplate.replace('_width_', width).replace('_height_', height).replace('_length_', imageString.length) + imageString + imageEndTemplate,
        xref = getXref(mainPage.length, content.length, info.length);

    var mainContent = mainPage + content + info + image,
        trailer = trailerTemplate.replace('_length_', mainContent.length);

    return mainContent + xref + trailer;
};

var getXref = function(mainPageLength, contentLength, infoLength) {
    return xrefTemplate.replace('_main_', pad(mainPageLength + '', 10))
        .replace('_info_', pad((mainPageLength + contentLength) + '', 10))
        .replace('_image_', pad((mainPageLength + contentLength + infoLength) + '', 10));
};

var getCurDate = function() {
    return new Date();
};

var getBlob = function(binaryData) {
    var i = 0,
        dataArray = new Uint8Array(binaryData.length);

    for(; i < binaryData.length; i++) {
        dataArray[i] = binaryData.charCodeAt(i);
    }

    return new window.Blob([dataArray.buffer], { type: 'application/pdf' });
};

var getBase64 = function(binaryData) {
    return window.btoa(binaryData);
};

exports.getData = function(data, options, callback) {
    var imageData = imageCreator.getImageData(data, extend({}, options, { format: 'JPEG' })),
        blob = new Deferred();

    blob.done(callback);

    return when(imageData).done(function(imageString) {
        var binaryData = composePdfString(imageString, options, getCurDate()),
            pdfData = isFunction(window.Blob) ?
                getBlob(binaryData) :
                getBase64(binaryData);

        blob.resolve(pdfData);
    });
};

///#DEBUG
exports.__tests = {
    set_composePdfString: function(func) {
        exports.__tests.composePdfString = composePdfString;
        composePdfString = func;
    },
    restore_composePdfString: function(func) {
        if(exports.__tests.composePdfString) {
            composePdfString = exports.__tests.composePdfString;
            exports.__tests.composePdfString = null;
        }
    },
    set_getCurDate: function(func) {
        exports.__tests.getCurDate = getCurDate;
        getCurDate = func;
    },
    restore_getCurDate: function(func) {
        if(exports.__tests.getCurDate) {
            getCurDate = exports.__tests.getCurDate;
            exports.__tests.getCurDate = null;
        }
    },
    set_getBlob: function(func) {
        exports.__tests.getBlob = getBlob;
        getBlob = func;
    },
    restore_getBlob: function(func) {
        if(exports.__tests.getBlob) {
            getBlob = exports.__tests.getBlob;
            exports.__tests.getBlob = null;
        }
    },
    set_getBase64: function(func) {
        exports.__tests.getBase64 = getBase64;
        getBase64 = func;
    },
    restore_getBase64: function(func) {
        if(exports.__tests.getBase64) {
            getBase64 = exports.__tests.getBase64;
            exports.__tests.getBase64 = null;
        }
    }
};
///#ENDDEBUG
