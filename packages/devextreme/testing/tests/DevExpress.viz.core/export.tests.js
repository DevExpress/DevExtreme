const vizMocks = require('../../helpers/vizMocks.js');
const exportModule = require('viz/core/export');
const themeModule = require('viz/themes');
const clientExporter = require('exporter');
const $ = require('jquery');
const combineMarkupsOrig = exportModule.combineMarkups;

themeModule.registerTheme({
    name: 'someTheme.light',
    backgroundColor: 'some_theme_color'
});

function createMockWidget(size, option) {
    const root = $('<div>').append($('<svg>'));

    return {
        element: sinon.stub().returns(root),
        getSize: sinon.stub().returns(size),
        option
    };
}

QUnit.module('Creation', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.incidentOccurred = sinon.spy();

        this.options = {
            enabled: true,
            printingEnabled: true,
            formats: ['JPEG'],
            backgroundColor: '#FFFFFF',
            font: {
                size: 16,
                color: '#707070',
                family: '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
                cursor: 'pointer',
                weight: 200
            },
            button: {
                margin: {
                    left: 1,
                    top: 2,
                    bottom: 3,
                    right: 4
                },
                'default': {
                    color: '#707070',
                    borderColor: '#b6b6b6',
                    backgroundColor: '#f5f5f5'
                },
                hover: {
                    color: '#333',
                    borderColor: '#bebebe',
                    backgroundColor: '#e6e6e6'
                },
                focus: {
                    color: '#000',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#e6e6e6'
                },
                active: {
                    color: '#333',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#d4d4d4'
                }
            },

            shadowColor: '#ababab'
        };

        this.toDataURLStub = sinon.stub(window.HTMLCanvasElement.prototype, 'toDataURL');
        this.toDataURLStub.returnsArg(0);
    },
    afterEach: function() {
        this.toDataURLStub.restore();
    },
    createExportMenu: function() {
        const exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test('Groups creation', function(assert) {
    // arrange
    this.createExportMenu();

    // assert
    assert.equal(this.renderer.g.callCount, 5, 'Three groups');
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.attr.getCall(0).args[0], { 'class': 'dx-export-menu', 'hidden-for-export': true }, 'Group attributes');
    assert.deepEqual(this.renderer.g.getCall(1).returnValue.attr.getCall(0).args[0], { 'class': 'dx-export-menu-button' }, 'Button css-class');
    assert.deepEqual(this.renderer.g.getCall(2).returnValue.attr.getCall(0).args[0], { 'class': 'dx-export-menu-list' }, 'List css-class');
    assert.deepEqual(this.renderer.g.getCall(3).returnValue.attr.getCall(0).args[0], { 'class': 'dx-export-menu-list-item' }, 'List item css-class');

    assert.equal(this.renderer.g.getCall(2).returnValue.append.getCall(0).args[0].element,
        this.renderer.g.getCall(0).returnValue.element, 'Element list is added to correct Parent');

    assert.equal(this.renderer.g.getCall(3).returnValue.append.getCall(0).args[0],
        this.renderer.g.getCall(2).returnValue);
});

QUnit.test('Button creation', function(assert) {
    // arrange, act
    this.createExportMenu();

    // assert
    assert.deepEqual(this.renderer.rect.getCall(1).args, [0, 0, 35, 35], 'Button rect');
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], {
        rx: 4,
        ry: 4,
        fill: '#f5f5f5',
        stroke: '#b6b6b6',
        'stroke-width': 1,
        cursor: 'pointer'
    }, 'Button rect style');
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [[9, 12, 26, 12, 26, 14, 9, 14], [9, 17, 26, 17, 26, 19, 9, 19], [9, 22, 26, 22, 26, 24, 9, 24]], 'button icon coords');
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], {
        fill: '#707070',
        cursor: 'pointer'
    }, 'Button arrow style');
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.data.getCall(0).args[0], {
        'export-element-type': 'button'
    }, 'Button events data');

    assert.deepEqual(this.renderer.g.getCall(1).returnValue.setTitle.getCall(0).args[0], 'Exporting/Printing', 'Hint for button');
});

QUnit.test('List creation', function(assert) {
    // arrange, act
    this.options.formats = ['JPEG', 'PNG'];
    this.createExportMenu();

    // assert
    // rect
    assert.deepEqual(this.renderer.rect.getCall(0).args, [-85, 39, 120, 0], 'List rect');
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], {
        'stroke-width': 1,
        cursor: 'pointer',
        filter: 'shadowFilter.id',
        rx: 4,
        ry: 4
    }, 'List rect style');
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(1).args[0], {
        fill: '#f5f5f5',
        stroke: '#b6b6b6',
        height: 92
    }, 'List rect style');

    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.data.getCall(0).args[0], { 'export-element-type': 'list' }, 'Rect data');
    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.append.lastCall.args[0], this.renderer.g.getCall(2).returnValue);
    assert.deepEqual(this.renderer.shadowFilter.getCall(0).args, ['-50%', '-50%', '200%', '200%', 2, 6, 3], 'Rect shadow creating');
    assert.deepEqual(this.renderer.shadowFilter.getCall(0).returnValue.attr.getCall(0).args[0], { opacity: 0.8 }, 'Rect shadow set opacity');
    assert.deepEqual(this.renderer.shadowFilter.getCall(0).returnValue.attr.getCall(1).args[0], { color: '#ababab' }, 'Rect shadow set Color');

    // separator

    assert.equal(this.renderer.path.getCall(1).args[1], 'line', 'List separator type');
    assert.deepEqual(this.renderer.path.getCall(1).returnValue.attr.getCall(0).args[0], {
        d: 'M -85 69 L 35 69',
        stroke: '#b6b6b6',
        'stroke-width': 1,
        sharp: 'v',
        cursor: 'pointer'
    }, 'List separator style');

    // texts
    assert.equal(this.renderer.text.callCount, 3, 'Texts count');

    // printing text
    assert.deepEqual(this.renderer.text.getCall(0).args, ['Print'], 'Printing text params');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        'font-size': 16,
        'font-family': '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fill: '#707070',
        'font-weight': 200,
        'pointer-events': 'none',
        cursor: 'pointer'
    }, 'Printing text style');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        'x': -70,
        'y': 62
    }, 'Printing text attributes');
    assert.deepEqual(this.renderer.rect.getCall(2).returnValue.data.getCall(0).args[0], {
        'export-element-type': 'printing'
    }, 'Printing rect events data');

    // JPEG group
    assert.deepEqual(this.renderer.text.getCall(1).args, ['JPEG file'], 'JPEG text params');
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.css.getCall(0).args[0], {
        'font-size': 16,
        'font-family': '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fill: '#707070',
        'pointer-events': 'none',
        'font-weight': 200,
        cursor: 'pointer'
    }, 'JPEG text style');
    assert.deepEqual(this.renderer.rect.getCall(3).returnValue.data.getCall(0).args[0], {
        'export-element-type': 'exporting',
        'export-element-format': 'JPEG'
    }, 'JPEG rect events data');
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 92
    }, 'JPEG text attrs');

    // PNG group
    assert.deepEqual(this.renderer.text.getCall(2).args, ['PNG file'], 'PNG text params');
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.css.getCall(0).args[0], {
        'font-size': 16,
        'font-family': '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fill: '#707070',
        'pointer-events': 'none',
        'font-weight': 200,
        cursor: 'pointer'
    }, 'PNG text style');
    assert.deepEqual(this.renderer.rect.getCall(4).returnValue.data.getCall(0).args[0], {
        'export-element-type': 'exporting',
        'export-element-format': 'PNG'
    }, 'PNG rect events data');
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 122
    }, 'PNG text attrs');
});

QUnit.test('List creation, without printing', function(assert) {
    // arrange, act
    this.options.printingEnabled = false;
    this.createExportMenu();

    // assert
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], {
        'stroke-width': 1,
        cursor: 'pointer',
        filter: 'shadowFilter.id',
        rx: 4,
        ry: 4
    }, 'list rect style');
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(1).args[0], {
        fill: '#f5f5f5',
        stroke: '#b6b6b6',
        height: 32
    }, 'list rect style');

    assert.equal(this.renderer.path.callCount, 1, 'paths count');
    assert.equal(this.renderer.text.callCount, 1, 'texts count');

    assert.deepEqual(this.renderer.text.getCall(0).args, ['JPEG file'], 'jpeg text params');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 62
    }, 'JPEG text attrs');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        'font-size': 16,
        'font-family': '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fill: '#707070',
        'pointer-events': 'none',
        'font-weight': 200,
        cursor: 'pointer'
    }, 'jpeg text style');
});

QUnit.test('List creation, without formats', function(assert) {
    // arrange, act
    this.options.formats = [];
    this.createExportMenu();

    // assert
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(1).args[0].height, 32, 'List rect');
    assert.deepEqual(this.renderer.rect.getCall(2).returnValue.css.getCall(0).args[0], {
        cursor: 'pointer',
        'pointer-events': 'all'
    }, 'List rect style');

    assert.equal(this.renderer.path.callCount, 2, 'Paths count');
    assert.equal(this.renderer.text.callCount, 1, 'Texts count');

    assert.deepEqual(this.renderer.text.getCall(0).args, ['Print'], 'Printing text params');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        x: -70,
        y: 62
    }, 'Printing text attributes');

    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        'font-size': 16,
        'font-family': '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fill: '#707070',
        'pointer-events': 'none',
        'font-weight': 200,
        cursor: 'pointer'
    }, 'Printing text style');
});

QUnit.test('List creation with unsupported image format - do not create item nor throw incident', function(assert) {
    // arrange
    this.toDataURLStub.withArgs('image/jpeg').returns('image/png');
    this.toDataURLStub.withArgs('image/gif').returns('image/png');

    this.options.formats = null;
    this.options.printingEnabled = false;

    // act
    this.createExportMenu();

    // assert
    assert.equal(this.renderer.text.callCount, 3);
    assert.deepEqual(this.renderer.text.getCall(0).args, ['PNG file'], 'PNG text params');
    assert.deepEqual(this.renderer.text.getCall(1).args, ['PDF file'], 'PDF text params');
    assert.deepEqual(this.renderer.text.getCall(2).args, ['SVG file'], 'SVG text params');
    assert.equal(this.incidentOccurred.callCount, 0);
});

QUnit.test('List creation with unsupported image format in options - do not create item but throw incident', function(assert) {
    // arrange
    this.toDataURLStub.withArgs('image/jpeg').returns('image/png');
    this.toDataURLStub.withArgs('image/gif').returns('image/png');

    this.options.formats = ['PNG', 'GIF', 'JPEG'];
    this.options.printingEnabled = false;

    // act
    this.createExportMenu();

    // assert
    assert.equal(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.getCall(0).args, ['PNG file'], 'SUPPORTED text params');
    assert.deepEqual(this.incidentOccurred.getCall(0).args, ['W2108', ['GIF']]);
    assert.deepEqual(this.incidentOccurred.getCall(1).args, ['W2108', ['JPEG']]);
});

QUnit.test('Without printing and formats', function(assert) {
    // arrange, act
    this.options.formats = [];
    this.options.printingEnabled = false;
    this.createExportMenu();

    // assert
    assert.equal(this.renderer.stub('rect').callCount, 1, 'List rect');
    assert.strictEqual(this.renderer.stub('rect').getCall(0).returnValue.stub('append').callCount, 0, 'List rect');
    assert.equal(this.renderer.stub('path').callCount, 0, 'No paths');
    assert.equal(this.renderer.stub('text').callCount, 0, 'No texts');
});

QUnit.test('Enabled options is false', function(assert) {
    // arrange, act
    this.options.enabled = false;
    this.createExportMenu();

    // assert
    assert.equal(this.renderer.stub('rect').callCount, 1, 'List rect');
    assert.strictEqual(this.renderer.stub('rect').getCall(0).returnValue.stub('append').callCount, 0, 'List rect');
    assert.equal(this.renderer.stub('path').callCount, 0, 'No paths');
    assert.equal(this.renderer.stub('text').callCount, 0, 'No texts');
});

QUnit.module('API. Markup manipulations', {
    checkAttrsValues(expectedSvgAttrs, root, assert) {
        Object.keys(expectedSvgAttrs).forEach((attrKey) => {
            const expectedAttrValue = expectedSvgAttrs[attrKey];
            const attrValue = root.getAttribute(attrKey);

            assert.strictEqual(attrValue, expectedAttrValue, `value of ${attrKey}`);
        });
    },
    checkBackgroundColor(backgroundValue, markup, assert) {
        const background = `data-backgroundcolor="${backgroundValue}"`;

        assert.strictEqual(markup.includes(background), true);
    }
});

QUnit.test('getMarkup method', function(assert) {
    const optionMock = (param) => {
        if(param === 'backgroundColor') return 'backgroundColor';
    };
    const widgets = [
        createMockWidget({ height: 25, width: 10 }, optionMock),
        createMockWidget({ height: 15, width: 15 }, optionMock),
    ];

    const markup = exportModule.getMarkup(widgets);

    this.checkBackgroundColor('backgroundColor', markup, assert);
});

QUnit.test('getMarkup. BackgroundColor in theme', function(assert) {
    const optionMock = (param) => {
        if(param === 'theme') return 'someTheme.light';
    };
    const widgets = [
        createMockWidget({ height: 25, width: 10 }, optionMock),
        createMockWidget({ height: 15, width: 15 }, optionMock)
    ];

    const markup = exportModule.getMarkup(widgets);

    this.checkBackgroundColor('some_theme_color', markup, assert);
});

QUnit.test('getMarkup. Different colors in charts. No backgroundColor in result', function(assert) {
    const colors = ['color_1', 'color_2'];
    let i = 0;
    const optionMock = (param) => {
        if(param === 'backgroundColor') return colors[i++];
    };
    const widgets = [
        createMockWidget({ height: 25, width: 10 }, optionMock),
        createMockWidget({ height: 15, width: 15 }, optionMock)
    ];

    const markup = exportModule.getMarkup(widgets);

    this.checkBackgroundColor('', markup, assert);
});

QUnit.test('Combine widgets markups (combineMarkups), just widget', function(assert) {
    const optionMock = (param) => {
        if(param === 'backgroundColor') return 'backgroundColor';
    };
    const widgets = [createMockWidget({ width: 10, height: 25 }, optionMock)];

    const markupData = exportModule.combineMarkups(widgets);

    const expectedSvgAttrs = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'version': '1.1',
        'fill': 'none',
        'stroke': 'none',
        'stroke-width': '0',
        'width': '10',
        'height': '25',
        'data-backgroundcolor': 'backgroundColor',
    };

    const expectedMarkup = '<defs></defs><g transform="translate(0,0)"><svg></svg></g>';

    assert.strictEqual(markupData.width, 10);
    assert.strictEqual(markupData.height, 25);

    assert.strictEqual(markupData.root.innerHTML, expectedMarkup);
    this.checkAttrsValues(expectedSvgAttrs, markupData.root, assert);
});

QUnit.test('Combine widgets markups (combineMarkups), array of widgets - column', function(assert) {
    const optionMock = (param) => {
        if(param === 'backgroundColor') return 'backgroundColor';
    };
    const widgets = [
        createMockWidget({ width: 10, height: 25 }, optionMock),
        createMockWidget({ width: 15, height: 15 }, optionMock),
    ];

    const markupData = exportModule.combineMarkups(widgets);

    const expectedSvgAttrs = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'version': '1.1',
        'fill': 'none',
        'stroke': 'none',
        'stroke-width': '0',
        'width': '15',
        'height': '40',
        'data-backgroundcolor': 'backgroundColor',
    };

    const expectedMarkup = '<defs></defs>'
        + '<g transform="translate(0,0)"><svg></svg></g>'
        + '<g transform="translate(0,25)"><svg></svg></g>';

    assert.strictEqual(markupData.width, 15);
    assert.strictEqual(markupData.height, 40);
    assert.strictEqual(markupData.root.innerHTML, expectedMarkup);
    this.checkAttrsValues(expectedSvgAttrs, markupData.root, assert);
});

QUnit.test('Combine widgets markups (combineMarkups), array of arrays of widgets - nested arrays are rows', function(assert) {
    const optionMock = (param) => {
        if(param === 'backgroundColor') return 'backgroundColor';
    };
    const markupData = exportModule.combineMarkups([
        [createMockWidget({ width: 10, height: 25 }, optionMock), createMockWidget({ width: 15, height: 15 }, optionMock)],
        [createMockWidget({ width: 20, height: 15 }, optionMock), createMockWidget({ width: 10, height: 35 }, optionMock)]
    ]);

    const expectedSvgAttrs = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'version': '1.1',
        'fill': 'none',
        'stroke': 'none',
        'stroke-width': '0',
        'width': '30',
        'height': '60',
        'data-backgroundcolor': 'backgroundColor',
    };
    const expectedMarkup = '<defs></defs>'
        + '<g transform="translate(0,0)"><svg></svg></g><g transform="translate(10,0)"><svg></svg></g>'
        + '<g transform="translate(0,25)"><svg></svg></g><g transform="translate(20,25)"><svg></svg></g>';

    assert.strictEqual(markupData.width, 30);
    assert.strictEqual(markupData.height, 60);

    assert.strictEqual(markupData.root.innerHTML, expectedMarkup);
    this.checkAttrsValues(expectedSvgAttrs, markupData.root, assert);
});

QUnit.test('Combine widgets markups (combineMarkups) in grid layout with center-center alignments', function(assert) {
    const optionMock = (param) => {
        if(param === 'backgroundColor') return 'backgroundColor';
    };

    const markupData = exportModule.combineMarkups([
        [createMockWidget({ width: 10, height: 25 }, optionMock), createMockWidget({ width: 16, height: 15 }, optionMock)],
        [createMockWidget({ width: 20, height: 15 }, optionMock), createMockWidget({ width: 10, height: 35 }, optionMock)]
    ], {
        gridLayout: true,
        verticalAlignment: 'center',
        horizontalAlignment: 'center'
    });

    const expectedSvgAttrs = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'version': '1.1',
        'fill': 'none',
        'stroke': 'none',
        'stroke-width': '0',
        'width': '40',
        'height': '60',
        'data-backgroundcolor': 'backgroundColor',
    };
    const expectedMarkup = '<defs></defs>'
        + '<g transform="translate(5,0)"><svg></svg></g><g transform="translate(22,5)"><svg></svg></g>'
        + '<g transform="translate(0,35)"><svg></svg></g><g transform="translate(25,25)"><svg></svg></g>';

    assert.strictEqual(markupData.width, 40);
    assert.strictEqual(markupData.height, 60);
    assert.strictEqual(markupData.root.innerHTML, expectedMarkup);
    this.checkAttrsValues(expectedSvgAttrs, markupData.root, assert);
});

QUnit.test('Combine widgets markups (combineMarkups) in grid layout with bottom-right alignments', function(assert) {
    const optionMock = (param) => {
        if(param === 'backgroundColor') return 'backgroundColor';
    };

    const markupData = exportModule.combineMarkups([
        [createMockWidget({ width: 10, height: 25 }, optionMock), createMockWidget({ width: 16, height: 15 }, optionMock)],
        [createMockWidget({ width: 20, height: 15 }, optionMock), createMockWidget({ width: 10, height: 35 }, optionMock)]
    ], {
        gridLayout: true,
        verticalAlignment: 'bottom',
        horizontalAlignment: 'right'
    });

    const expectedSvgAttrs = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'version': '1.1',
        'fill': 'none',
        'stroke': 'none',
        'stroke-width': '0',
        'width': '40',
        'height': '60',
        'data-backgroundcolor': 'backgroundColor',
    };
    const expectedMarkup = '<defs></defs>'
        + '<g transform="translate(10,0)"><svg></svg></g><g transform="translate(24,10)"><svg></svg></g>'
        + '<g transform="translate(0,45)"><svg></svg></g><g transform="translate(30,25)"><svg></svg></g>';

    assert.strictEqual(markupData.width, 40);
    assert.strictEqual(markupData.height, 60);
    assert.strictEqual(markupData.root.innerHTML, expectedMarkup);
    this.checkAttrsValues(expectedSvgAttrs, markupData.root, assert);
});

QUnit.module('API. Export methods', {
    beforeEach: function() {
        sinon.stub(clientExporter, 'export');
        this.toDataURLStub = sinon.stub(window.HTMLCanvasElement.prototype, 'toDataURL');
        this.toDataURLStub.returnsArg(0);
    },
    afterEach: function() {
        clientExporter.export.restore();
        exportModule.DEBUG_set_combineMarkups(combineMarkupsOrig);
        this.toDataURLStub.restore();
    }
});

QUnit.test('exportFromMarkup method. Defaults', function(assert) {
    // arrange
    const options = {
        width: 600,
        height: 400
    };
    const markup = 'testMarkup';

    // act
    exportModule.exportFromMarkup(markup, options);

    // assert
    assert.equal(clientExporter.export.callCount, 1, 'Export was called');
    assert.deepEqual(clientExporter.export.getCall(0).args[0], 'testMarkup', 'Export data');
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: 'PNG',
        fileName: 'file',
        width: 600,
        height: 400,
        margin: 10,
        fileSavingAction: undefined,
        exportingAction: undefined,
        exportedAction: undefined,
        backgroundColor: '#ffffff'
    }, 'Export options');
});

QUnit.test('exportFromMarkup method. Set options', function(assert) {
    // arrange
    const options = {
        format: 'jpeg',
        fileName: 'file1',
        width: 600,
        height: 400,
        margin: 0,
        backgroundColor: '#00ff00',
        onFileSaving: 'file saving callback',
        onExporting: 'exporting callback',
        onExported: 'exported callback',
    };
    const markup = 'testMarkup';

    // act
    exportModule.exportFromMarkup(markup, options);

    // assert
    assert.equal(clientExporter.export.callCount, 1, 'Export was called');
    assert.deepEqual(clientExporter.export.getCall(0).args[0], 'testMarkup', 'Export data');
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: 'JPEG',
        fileName: 'file1',
        width: 600,
        height: 400,
        margin: 0,
        backgroundColor: '#00ff00',
        onFileSaving: 'file saving callback',
        onExporting: 'exporting callback',
        onExported: 'exported callback',
        fileSavingAction: 'file saving callback',
        exportingAction: 'exporting callback',
        exportedAction: 'exported callback'
    }, 'Export options');
});

QUnit.test('exportFromMarkup unsupported image format - export as PNG', function(assert) {
    // arrange
    this.toDataURLStub.withArgs('image/gif').returns('image/png');

    const options = {
        format: 'gif',
        fileName: 'file1',
        width: 600,
        height: 400,
        margin: 0,
        backgroundColor: '#00ff00',
        onFileSaving: 'file saving callback',
        onExporting: 'exporting callback',
        onExported: 'exported callback',
    };
    const markup = 'testMarkup data-backgroundcolor="someColor"';

    // act
    exportModule.exportFromMarkup(markup, options);

    // assert
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: 'PNG',
        fileName: 'file1',
        width: 600,
        height: 400,
        margin: 0,
        backgroundColor: '#00ff00',
        onFileSaving: 'file saving callback',
        onExporting: 'exporting callback',
        onExported: 'exported callback',
        fileSavingAction: 'file saving callback',
        exportingAction: 'exporting callback',
        exportedAction: 'exported callback'
    }, 'Export options');
});

QUnit.test('exportFromMarkup. backgroundColor from markup', function(assert) {
    // arrange
    const options = {
        width: 600,
        height: 400
    };
    const markup = 'testMarkup data-backgroundcolor="someColor"';

    // act
    exportModule.exportFromMarkup(markup, options);

    // assert
    assert.equal(clientExporter.export.callCount, 1, 'Export was called');
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        backgroundColor: 'someColor',
        format: 'PNG',
        fileName: 'file',
        width: 600,
        height: 400,
        margin: 10,
        fileSavingAction: undefined,
        exportingAction: undefined,
        exportedAction: undefined
    }, 'Export options');
});

QUnit.test('exportFromMarkup. backgroundColor from current theme', function(assert) {
    // arrange
    const options = {
        width: 600,
        height: 400
    };
    const markup = 'testMarkup';
    const currentTheme = themeModule.currentTheme();

    themeModule.currentTheme('someTheme.light');

    try {
        // act
        exportModule.exportFromMarkup(markup, options);

        // assert
        assert.equal(clientExporter.export.getCall(0).args[1].backgroundColor, 'some_theme_color');
    } finally {
        themeModule.currentTheme(currentTheme);
    }
});

QUnit.test('exportWidgets method should be able export plain DOM element (T1266360)', function(assert) {
    const optionMock = () => {
        return {
            fileName: 'chart',
            format: 'PNG',
        };
    };

    const widgets = [
        createMockWidget({ height: 25, width: 10 }, optionMock),
    ];

    widgets.forEach(widget => {
        const originalElement = widget.element();
        widget.element = sinon.stub().returns(originalElement[0]); // Get native DOM
    });

    try {
        exportModule.exportWidgets(widgets);
        assert.strictEqual(clientExporter.export.getCall(0).args[0].nodeName, 'svg', 'combineMarkups should pass to export DOM node');
    } catch(error) {
        assert.ok(false, 'exportWidgets doesnt work when plain DOM is passed as argument');
    }
});

QUnit.test('exportWidgets method should pass to export markup as DOM node', function(assert) {
    const optionMock = (param) => {
        if(param === 'theme') return 'someTheme.light';
    };
    const widgets = [
        createMockWidget({ height: 25, width: 10 }, optionMock),
        createMockWidget({ height: 15, width: 15 }, optionMock),
    ];

    exportModule.exportWidgets(widgets);

    assert.strictEqual(clientExporter.export.getCall(0).args[0].nodeName, 'svg', 'combineMarkups should pass to export DOM node');
});

QUnit.test('exportWidgets method. Defaults', function(assert) {
    // arrange
    exportModule.DEBUG_set_combineMarkups(sinon.spy(function() {
        return { root: 'testMarkup', width: 600, height: 400 };
    }));

    // act
    exportModule.exportWidgets([{ widget1: true }, { widget2: true }]);

    // assert
    assert.deepEqual(exportModule.combineMarkups.getCall(0).args, [
        [{ widget1: true }, { widget2: true }],
        {
            gridLayout: undefined,
            verticalAlignment: undefined,
            horizontalAlignment: undefined
        }
    ]);
    assert.equal(clientExporter.export.callCount, 1, 'Export was called');
    assert.deepEqual(clientExporter.export.getCall(0).args[0], 'testMarkup', 'Export data');
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: 'PNG',
        fileName: 'file',
        width: 600,
        height: 400,
        margin: 10,
        fileSavingAction: undefined,
        exportingAction: undefined,
        exportedAction: undefined,
        backgroundColor: '#ffffff'
    }, 'Export options');
});

QUnit.test('exportWidgets method. Set options. Size options are ignored', function(assert) {
    // arrange
    const options = {
        format: 'jpeg',
        fileName: 'file1',
        width: 1000,
        height: 2000,
        margin: 0,
        backgroundColor: '#00ff00',
        onFileSaving: 'file saving callback',
        onExporting: 'exporting callback',
        onExported: 'exported callback',
        gridLayout: true,
        verticalAlignment: 'bottom',
        horizontalAlignment: 'right'
    };
    exportModule.DEBUG_set_combineMarkups(sinon.spy(function() {
        return { root: 'testMarkup', width: 600, height: 400 };
    }));

    // act
    exportModule.exportWidgets([{ widget1: true }, { widget2: true }], options);

    // assert
    assert.deepEqual(exportModule.combineMarkups.getCall(0).args, [
        [{ widget1: true }, { widget2: true }],
        {
            gridLayout: true,
            verticalAlignment: 'bottom',
            horizontalAlignment: 'right'
        }
    ]);
    assert.equal(clientExporter.export.callCount, 1, 'Export was called');
    assert.deepEqual(clientExporter.export.getCall(0).args[0], 'testMarkup', 'Export data');
    assert.deepEqual(clientExporter.export.getCall(0).args[1], {
        format: 'JPEG',
        fileName: 'file1',
        width: 600,
        height: 400,
        margin: 0,
        backgroundColor: '#00ff00',
        onFileSaving: 'file saving callback',
        onExporting: 'exporting callback',
        onExported: 'exported callback',
        fileSavingAction: 'file saving callback',
        exportingAction: 'exporting callback',
        exportedAction: 'exported callback',
        gridLayout: true,
        verticalAlignment: 'bottom',
        horizontalAlignment: 'right'
    }, 'Export options');
});

QUnit.module('API', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.incidentOccurred = sinon.spy();

        sinon.stub(clientExporter, 'export');
        this.options = {
            printingEnabled: true,
            formats: ['JPEG'],
            enabled: true,
            font: {},

            button: {
                margin: {
                    left: 1,
                    top: 2,
                    bottom: 3,
                    right: 4
                },
                'default': {
                    color: '#707070',
                    borderColor: '#b6b6b6',
                    backgroundColor: '#f5f5f5'
                },
                hover: {
                    color: '#333',
                    borderColor: '#bebebe',
                    backgroundColor: '#e6e6e6'
                },
                focus: {
                    color: '#000',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#e6e6e6'
                },
                active: {
                    color: '#333',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#d4d4d4'
                }
            },
            exportOptions: {
                width: 100,
                height: 200
            }
        };
        this.toDataURLStub = sinon.stub(window.HTMLCanvasElement.prototype, 'toDataURL');
        this.toDataURLStub.returnsArg(0);
        this.srcCurrentTheme = themeModule.currentTheme();
    },
    afterEach: function() {
        clientExporter.export.restore();
        this.toDataURLStub.restore();
        themeModule.currentTheme(this.srcCurrentTheme);
    },
    createExportMenu: function() {
        const exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test('Get layout options', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    const layout = exportMenu.getLayoutOptions();

    // assert
    assert.deepEqual(layout, {
        cutLayoutSide: 'top',
        cutSide: 'vertical',
        height: 20,
        width: 20,
        x: 1,
        y: 2,
        horizontalAlignment: 'right',
        position: {
            horizontal: 'right',
            vertical: 'top'
        },
        verticalAlignment: 'top'
    }, 'layout options');
    assert.equal(this.renderer.g.getCall(1).returnValue.getBBox.callCount, 1, 'getBBox is called');
});

QUnit.test('Draw', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.draw(100, 60, { width: 30, height: 30, left: 50 });

    // assert
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.getCall(0).args, [110, 12], 'group moving');
});

QUnit.test('Shift', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    this.renderer.g.getCall(0).returnValue.attr.resetHistory();

    // act
    exportMenu.shift(10, 20);

    // assert
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.attr.getCall(1).args[0], { translateY: 20 }, 'y shifting');
});

QUnit.test('Move', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    this.renderer.g.getCall(0).returnValue.attr.resetHistory();

    // act
    exportMenu.move([10, 20]);

    // assert
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 11, translateY: 22 });
});

QUnit.test('Measure', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();
    // act
    const size = exportMenu.measure();
    // assert
    assert.deepEqual(size, [40, 40]);
});

QUnit.test('Hide', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.hide();

    // assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkRemove.callCount, 1, 'link is removed');
});

QUnit.test('Show', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.show();

    // assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkAppend.callCount, 2, 'link is appended');
});

QUnit.test('Set options', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    this.renderer.rect.resetHistory();
    this.renderer.text.resetHistory();
    this.renderer.path.resetHistory();

    // act
    exportMenu.setOptions({
        enabled: true,
        formats: ['png', 'abc'],
        printingEnabled: false,
        font: {
            size: 16,
            color: '#707070',
            cursor: 'pointer',
            family: '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
            weight: 200
        },
        button: {
            'default': {
                color: '#707070',
                borderColor: '#b6b6b6',
                backgroundColor: '#f5f5f5'
            },
            hover: {
                color: '#333',
                borderColor: '#bebebe',
                backgroundColor: '#e6e6e6'
            },
            focus: {
                color: '#000',
                borderColor: '#9d9d9d',
                backgroundColor: '#e6e6e6'
            },
            active: {
                color: '#333',
                borderColor: '#9d9d9d',
                backgroundColor: '#d4d4d4'
            }
        },
        backgroundColor: '#f5f5f5',
        menuButtonColor: '#f5f5f5',
        borderColor: '#b6b6b6'
    });

    // assert
    const listGroup = this.renderer.g.getCall(2).returnValue;

    assert.equal(listGroup.clear.callCount, 2, 'clearing');
    assert.equal(this.renderer.rect.callCount, 1, 'rect');
    assert.equal(this.renderer.path.callCount, 0, 'path');
    assert.equal(this.renderer.text.callCount, 1, 'text');

    assert.deepEqual(this.renderer.rect.getCall(0).args, [], 'List rect');
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], {
        height: 30,
        width: 118,
        x: -84,
        y: 40
    }, 'List rect attributes');

    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.css.getCall(0).args[0], {
        'pointer-events': 'all',
        cursor: 'pointer'
    }, 'List rect style');

    assert.deepEqual(this.renderer.text.getCall(0).args, ['PNG file'], 'PNG text params');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], {
        'x': -70,
        'y': 62
    }, 'PNG text attributes');
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        'font-size': 16,
        'font-family': '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fill: '#707070',
        'pointer-events': 'none',
        'font-weight': 200,
        cursor: 'pointer'
    }, 'PNG text style');
});

QUnit.test('Dispose', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.dispose();

    // assert
    assert.equal(this.renderer.g.getCall(0).returnValue.dispose.callCount, 1, 'Group dispose was called');
    assert.equal(this.renderer.shadowFilter.getCall(0).returnValue.dispose.callCount, 1, 'Shadow filter dispose was called');
});

QUnit.module('Events', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.incidentOccurred = sinon.spy();

        sinon.stub(clientExporter, 'export');

        this.options = {
            enabled: true,
            printingEnabled: true,
            formats: ['JPEG'],
            font: {},
            backgroundColor: '#001122',
            button: {
                'default': {
                    color: '#707070',
                    borderColor: '#b6b6b6',
                    backgroundColor: '#123456'
                },
                hover: {
                    color: '#333',
                    borderColor: '#bebebe',
                    backgroundColor: '#e6e6e6'
                },
                focus: {
                    color: '#000',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#e6e6e6'
                },
                active: {
                    color: '#333',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#d4d4d4'
                }
            },
            exportOptions: {}
        };
    },
    afterEach: function() {
        clientExporter.export.restore();
    },
    createExportMenu: function() {
        const exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            exportTo: this.exportTo || function() {},
            print: this.print || function() {},
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test('\'On\' subscribe', function(assert) {
    // arrange, act
    this.createExportMenu();

    // assert
    assert.equal(this.renderer.root.on.callCount, 1, 'one subscribe');
    assert.equal(this.renderer.root.on.getCall(0).args[0], 'dxpointerup.export', 'event name');
    assert.ok(this.renderer.root.on.getCall(0).args[1], 'event handler');

    assert.equal(this.renderer.rect.getCall(2).returnValue.on.callCount, 2, 'menu item subscribe count');
    assert.equal(this.renderer.rect.getCall(2).returnValue.on.getCall(0).args[0], 'dxhoverstart.export', 'menu item subscribe hover start');
    assert.equal(this.renderer.rect.getCall(2).returnValue.on.getCall(1).args[0], 'dxhoverend.export', 'menu item subscribe hover end');
    assert.equal(this.renderer.rect.getCall(2).returnValue.on.getCall(1).args[0], 'dxhoverend.export', 'menu item subscribe hover end');
    assert.equal(this.renderer.g.getCall(1).returnValue.on.getCall(2).args[0], 'dxpointerdown.export', 'button subscribe mousedown end');

    assert.equal(this.renderer.g.getCall(2).returnValue.on.callCount, 1, 'list subscribing');
    assert.equal(this.renderer.g.getCall(1).returnValue.on.callCount, 3, 'button subscribing');
});

QUnit.test('\'Off\' unsubscribe', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.dispose();

    // assert
    assert.equal(this.renderer.root.off.callCount, 1, 'one unsubscribe');
    assert.equal(this.renderer.root.off.getCall(0).args[0], '.export', 'event name');
    assert.equal(this.renderer.g.getCall(1).returnValue.off.callCount, 1, 'off for button');
    assert.equal(this.renderer.g.getCall(2).returnValue.off.callCount, 1, 'off for list');
});

QUnit.test('Button hover', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();

    // act
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: '#e6e6e6', stroke: '#bebebe' }, 'hovered button');
});

QUnit.test('Button mousedown', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();
    // act
    this.renderer.g.getCall(1).returnValue.on.getCall(2).args[1]({ target: { 'export-element-type': 'button' } });
    // assert
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: '#d4d4d4', stroke: '#9d9d9d' }, 'Button set active state');
});

QUnit.test('Button unhover', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();

    // act
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.g.getCall(1).returnValue.on.getCall(1).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(1).args[0], { fill: '#123456', stroke: '#b6b6b6' }, 'unhovered button');
});

QUnit.test('menuItem hover', function(assert) {
    // arrange
    this.createExportMenu();
    const menuItemRect = this.renderer.rect.getCall(2).returnValue;

    menuItemRect.attr.resetHistory();

    // act
    menuItemRect.on.getCall(0).args[1]();

    // assert
    assert.deepEqual(menuItemRect.attr.getCall(0).args[0], { fill: '#e6e6e6' }, 'Menu item hovered');
});

QUnit.test('menuItem unhover', function(assert) {
    // arrange
    this.createExportMenu();
    const menuItemRect = this.renderer.rect.getCall(2).returnValue;

    menuItemRect.attr.resetHistory();

    // act
    menuItemRect.on.getCall(0).args[1]();
    menuItemRect.on.getCall(1).args[1]();

    // assert
    assert.deepEqual(menuItemRect.attr.getCall(0).args[0], { fill: '#e6e6e6' }, 'Menu item unhovered');
    assert.deepEqual(menuItemRect.attr.getCall(1).args[0], { fill: null }, 'Menu item unhovered');
});

QUnit.test('Button hover when button is selected', function(assert) {
    // arrange
    this.createExportMenu();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.equal(this.renderer.rect.getCall(1).returnValue.attr.callCount, 1, 'non-hovered but selected button');
});

QUnit.test('Button unhover when button is selected', function(assert) {
    // arrange
    this.createExportMenu();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.g.getCall(1).returnValue.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();
    this.renderer.g.getCall(1).returnValue.on.getCall(1).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.equal(this.renderer.rect.getCall(1).returnValue.attr.callCount, 1, 'non-hovered but selected button');
});

QUnit.test('List opening', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.resetHistory();
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.equal(this.renderer.g.getCall(2).returnValue.append.callCount, 2, 'showing call count');
    assert.deepEqual(this.renderer.g.getCall(2).returnValue.append.getCall(0).args[0], this.renderer.g.getCall(2).returnValue.append.getCall(1).args[0], 'visible list');
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: '#e6e6e6', stroke: '#9d9d9d' }, 'selected button has focused state style');
});

QUnit.test('Correct texts positions on list opening', function(assert) {
    // arrange
    this.createExportMenu();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.move.lastCall.args, [-71]);
});

QUnit.test('Correct texts positions on list opening. RTL', function(assert) {
    // arrange
    this.options.rtl = true;
    this.options.printingEnabled = false;
    this.createExportMenu();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.move.lastCall.args, [-1]);
});

QUnit.test('List closing by menu button', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.resetHistory();
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.equal(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, 'showing call count');
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(1).args[0], { fill: '#123456', stroke: '#b6b6b6' }, 'unselected button has default state style');
});

QUnit.test('List closing by any place', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();
    this.renderer.root.on.getCall(0).args[1]({ target: {} });

    // assert
    assert.equal(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, 'showing call count');
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: '#123456', stroke: '#b6b6b6' }, 'unselected button');
});

QUnit.test('List isn\'t closing by click on list', function(assert) {
    // arrange
    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'list' } });

    // assert
    assert.equal(this.renderer.g.getCall(2).returnValue.append.callCount, 2, 'Appending call count');
    assert.equal(this.renderer.g.getCall(2).returnValue.remove.callCount, 1, 'Removing call count');
});

QUnit.test('Exporting by click on format text', function(assert) {
    // arrange
    this.exportTo = sinon.spy();

    const exportMenu = this.createExportMenu();
    exportMenu.draw(50, 50, { width: 15, height: 25 });

    this.renderer.g.getCall(2).returnValue.attr.resetHistory();
    this.renderer.g.getCall(0).returnValue.linkAppend.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();
    this.renderer.root.on.getCall(0).args[1]({
        target: {
            'export-element-type': 'exporting',
            'export-element-format': 'JPEG'
        }
    });

    // assert
    assert.equal(this.exportTo.callCount, 1);
    assert.deepEqual(this.exportTo.getCall(0).args, ['JPEG']);

    assert.deepEqual(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, 'list is closed');
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: '#123456', stroke: '#b6b6b6' }, 'unselected button');
});

QUnit.test('Open list after exporting - previously clicked item is unhovered. T511729', function(assert) {
    const exportMenu = this.createExportMenu();
    exportMenu.draw(50, 50, { width: 15, height: 25 });

    const menuItemRect = this.renderer.rect.getCall(2).returnValue;
    menuItemRect.attr.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    menuItemRect.on.getCall(0).args[1]();
    this.renderer.root.on.getCall(0).args[1]({
        target: {
            'export-element-type': 'exporting',
            'export-element-format': 'JPEG'
        }
    });
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });

    // assert
    assert.deepEqual(menuItemRect.attr.callCount, 2);
    assert.deepEqual(menuItemRect.attr.lastCall.args[0], { fill: null }, 'Menu item unhovered');
});

QUnit.test('Printing by menu - close list', function(assert) {
    this.print = sinon.spy();

    this.createExportMenu();

    this.renderer.g.getCall(2).returnValue.attr.resetHistory();
    this.renderer.g.getCall(0).returnValue.linkAppend.resetHistory();

    // act
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'button' } });
    this.renderer.rect.getCall(1).returnValue.attr.resetHistory();
    this.renderer.root.on.getCall(0).args[1]({ target: { 'export-element-type': 'printing' } });

    // assert
    assert.equal(this.print.callCount, 1);

    assert.deepEqual(this.renderer.g.getCall(2).returnValue.remove.callCount, 2, 'list is closed');
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: '#123456', stroke: '#b6b6b6' }, 'unselected button');
});

// T397838
QUnit.test('Localization', function(assert) {
    // assert
    const localization = require('localization');

    localization.loadMessages({
        it: {
            'vizExport-printingButtonText': 'Stampa',
            'vizExport-exportButtonText': '{0} formato',
            'vizExport-titleMenuText': 'Esportazione / stampa'
        }
    });

    this.options.formats = ['PNG'];

    localization.locale('it');
    this.createExportMenu();

    assert.deepEqual(this.renderer.text.getCall(0).args, ['Stampa'], 'Printing button text');
    assert.deepEqual(this.renderer.text.getCall(1).args, ['PNG formato'], 'Export button text');
    assert.deepEqual(this.renderer.g.getCall(1).returnValue.setTitle.getCall(0).args, ['Esportazione / stampa'], 'Export menu button title text');

});

QUnit.module('Layout', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.incidentOccurred = sinon.spy();

        sinon.stub(clientExporter, 'export');

        this.options = {
            enabled: true,
            printingEnabled: true,
            formats: ['JPEG'],
            font: {},
            button: {
                'default': {
                    color: '#707070',
                    borderColor: '#b6b6b6',
                    backgroundColor: '#123456'
                },
                hover: {
                    color: '#333',
                    borderColor: '#bebebe',
                    backgroundColor: '#e6e6e6'
                },
                focus: {
                    color: '#000',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#e6e6e6'
                },
                active: {
                    color: '#333',
                    borderColor: '#9d9d9d',
                    backgroundColor: '#d4d4d4'
                }
            },
            exportOptions: {}
        };
    },
    afterEach: function() {
        clientExporter.export.restore();
    },
    createExportMenu: function() {
        const exportMenu = new exportModule.ExportMenu({
            renderer: this.renderer,
            incidentOccurred: this.incidentOccurred
        });
        exportMenu.setOptions(this.options);
        return exportMenu;
    }
});

QUnit.test('Menu is hidden if there is no enough space', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    // assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkRemove.callCount, 1);
});

QUnit.test('freeSpace', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();
    exportMenu.draw(100, 200, { width: 30, height: 30 });

    // act
    exportMenu.freeSpace();

    // assert
    assert.equal(this.renderer.g.getCall(0).returnValue.linkRemove.callCount, 1);
});

QUnit.test('Return empty layout options if was hidden due to small container', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    // act
    const layout = exportMenu.getLayoutOptions();

    // assert
    assert.deepEqual(layout, { width: 0, height: 0, cutSide: 'vertical', cutLayoutSide: 'top' });
});

QUnit.test('Send warning message if was hidden due to small container', function(assert) {
    // arrange
    const exportMenu = this.createExportMenu();

    // act
    exportMenu.draw(10, 20, { width: 30, height: 30 });

    // assert
    assert.ok(this.incidentOccurred.calledWith('W2107'));
});
