import { clearDxObjectAssign, initializeDxObjectAssign } from '../commonParts/objectAssignHelper.js';
import { jsPDF } from 'jspdf';
import { isFunction, isObject, isDefined } from 'core/utils/type';
import { extend } from 'core/utils/extend';
import $ from 'jquery';

const moduleConfig = {
    before: function() {
        initializeDxObjectAssign();
    },
    beforeEach: function() {
        // The transpiling of the script on the drone and locally has differences that affect the imported jsPDF type.
        const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
        this.jsPDFDocument = _jsPDF();
        this.customizeCellCallCount = 0;
    },
    after: function() {
        clearDxObjectAssign();
    }
};

function argumentsToString() {
    const items = [];
    for(let i = 0; i < arguments.length; i++) { // Array.from(arguments) is not supported in IE
        items.push(arguments[i]);
    }
    for(let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if(isObject(item)) {
            items[i] = '{' + Object.keys(item).map((key) => key + ':' + item[key]).join(',') + '}';
        }
    }
    return items.toString();
}

function createMockPdfDoc(options) {
    const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
    const unit = isDefined(options) && isDefined(options.unit)
        ? options.init
        : 'pt';
    const pdfOptions = extend(options || {}, { unit });
    const result = _jsPDF(pdfOptions);
    result.__log = [];

    result.__logOptions = { textOptions: {} };

    result.__setDrawColor = result.setDrawColor;
    result.setDrawColor = function() {
        this.__log.push('setDrawColor,' + argumentsToString.apply(null, arguments));
        this.__setDrawColor.apply(this, arguments);
    };

    result.__setFillColor = result.setFillColor;
    result.setFillColor = function() {
        this.__log.push('setFillColor,' + argumentsToString.apply(null, arguments));
        this.__setFillColor.apply(this, arguments);
    };

    result.__setFont = result.setFont;
    result.setFont = function() {
        this.__log.push('setFont,' + argumentsToString.apply(null, arguments));
        this.__setFont.apply(this, arguments);
    };

    result.__setFontSize = result.setFontSize;
    result.setFontSize = function() {
        this.__log.push('setFontSize,' + argumentsToString.apply(null, arguments));
        this.__setFontSize.apply(this, arguments);
    };

    result.__setLineHeightFactor = result.setLineHeightFactor;
    result.setLineHeightFactor = function() {
        this.__log.push('setLineHeightFactor,' + argumentsToString.apply(null, arguments));
        this.__setLineHeightFactor.apply(this, arguments);
    };

    result.__setTextColor = result.setTextColor;
    result.setTextColor = function() {
        this.__log.push('setTextColor,' + argumentsToString.apply(null, arguments));
        this.__setTextColor.apply(this, arguments);
    };

    result.__rect = result.rect;
    result.rect = function() {
        this.__log.push('rect,' + argumentsToString.apply(null, arguments));
        this.__rect.apply(this, arguments);
    };

    result.__line = result.line;
    result.line = function() {
        this.__log.push('line,' + argumentsToString.apply(null, arguments));
        this.__line.apply(this, arguments);
    };

    result.__setLineWidth = result.setLineWidth;
    result.setLineWidth = function() {
        this.__log.push('setLineWidth,' + argumentsToString.apply(null, arguments));
        this.__setLineWidth.apply(this, arguments);
    };

    result.__text = result.text;
    result.text = function() {
        if(this.__logOptions.textOptions === false) {
            arguments[3] = undefined;
        } else if(this.__logOptions.textOptions.hAlign !== true && arguments.length >= 3 && isDefined(arguments[3]) && arguments[3].align === 'left') {
            delete arguments[3].align;
        }
        this.__log.push('text,' + argumentsToString.apply(null, arguments));
        this.__text.apply(this, arguments);
    };

    result.__moveTo = result.moveTo;
    result.moveTo = function() {
        this.__log.push('moveTo,' + argumentsToString.apply(null, arguments));
        this.__moveTo.apply(this, arguments);
    };

    result.__lineTo = result.lineTo;
    result.lineTo = function() {
        this.__log.push('lineTo,' + argumentsToString.apply(null, arguments));
        this.__lineTo.apply(this, arguments);
    };

    result.__clip = result.clip;
    result.clip = function() {
        this.__log.push('clip,' + argumentsToString.apply(null, arguments));
        this.__clip.apply(this, arguments);
    };

    result.__discardPath = result.discardPath;
    result.discardPath = function() {
        this.__log.push('discardPath,' + argumentsToString.apply(null, arguments));
        this.__discardPath.apply(this, arguments);
    };

    result.__saveGraphicsState = result.saveGraphicsState;
    result.saveGraphicsState = function() {
        this.__log.push('saveGraphicsState,' + argumentsToString.apply(null, arguments));
        this.__saveGraphicsState.apply(this, arguments);
    };

    result.__restoreGraphicsState = result.restoreGraphicsState;
    result.restoreGraphicsState = function() {
        this.__log.push('restoreGraphicsState,' + argumentsToString.apply(null, arguments));
        this.__restoreGraphicsState.apply(this, arguments);
    };

    result.__addPage = result.addPage;
    result.addPage = function() {
        this.__log.push('addPage,' + argumentsToString.apply(null, arguments));
        this.__addPage.apply(this, arguments);
    };

    return result;
}

function createDataGrid(options) {
    if(!isDefined(options.loadingTimeout)) {
        options.loadingTimeout = null;
    }
    return $('#dataGrid').dxDataGrid(options).dxDataGrid('instance');
}

export { moduleConfig, createDataGrid, createMockPdfDoc };

