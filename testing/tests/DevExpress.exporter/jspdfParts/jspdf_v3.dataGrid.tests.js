import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isFunction, isObject } from 'core/utils/type';

import 'ui/data_grid';
import { exportDataGrid } from 'exporter/jspdf/export_data_grid_3';
import { initializeDxObjectAssign, clearDxObjectAssign } from '../commonParts/objectAssignHelper.js';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

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

function createMockPdfDoc() {
    const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
    const result = _jsPDF({ unit: 'pt' });
    result.__log = [];

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
        if(arguments.length >= 3 && arguments[3].baseline === 'alphabetic') {
            arguments[3] = undefined;
        }
        this.__log.push('text,' + argumentsToString.apply(null, arguments));
        this.__text.apply(this, arguments);
    };

    result.__addPage = result.addPage;
    result.addPage = function() {
        this.__log.push('addPage,' + argumentsToString.apply(null, arguments));
        this.__addPage.apply(this, arguments);
    };

    return result;
}

function createDataGrid(options) {
    options.loadingTimeout = null;
    return $('#dataGrid').dxDataGrid(options).dxDataGrid('instance');
}

QUnit.module('Table', moduleConfig, () => {

    QUnit.test('Required arguments', function(assert) {
        // TODO
        assert.ok(true);
    });

    QUnit.test('Empty', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({});

        const expectedLog = [
            'setLineWidth,1', 'rect,10,15,0,0',
        ];

        const customizeCell = () => {
            assert.fail('customizeCell should not be called');
        };
        const onRowExporting = () => {
            assert.fail('onRowExporting should not be called');
        };

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, customizeCell, onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
