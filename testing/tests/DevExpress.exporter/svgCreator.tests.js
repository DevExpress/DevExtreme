const $ = require('jquery');
const isFunction = require('core/utils/type').isFunction;
const exporter = require('exporter').svg;
const svgCreator = exporter.creator;
const svgUtils = require('core/utils/svg');

function setupCanvasStub() {
    // Blob
    isFunction(Blob) && sinon.stub(window, 'Blob', function(arrayBuffer, options) {
        return {
            arrayBuffer: arrayBuffer,
            options: options
        };
    });

}

function checkForBlob(assert) {
    if(this.blobSupported) {
        return true;
    }

    assert.ok(true, 'Skip if there isn\'t blob');
    return false;
}

function teardownCanvasStub() {
    // Blob
    isFunction(Blob) && window.Blob.restore();
}

QUnit.module('Svg creator. Get Data', {
    beforeEach: function() {
        this.blobArguments = {};

        setupCanvasStub(this.blobArguments);
        this.blobSupported = isFunction(Blob);
    },
    afterEach: function() {
        delete this.blobSupported;
        teardownCanvasStub();
    }
});

QUnit.test('getData', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const versionXML = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    const testingMarkup = '<svg xmlns="http://www.w3.org/2000/svg" class="dxc dxc-chart" style="line-height: normal; overflow: hidden; display: block; -ms-user-select: none; -ms-touch-action: pan-x pan-y pinch-zoom; touch-action: pan-x pan-y pinch-zoom; -moz-user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);" fill="none" stroke="none" stroke-width="0" width="500" height="250" version="1.1"><path stroke="#ff0000" stroke-width="2" d="M 36 181 L 184 98 L 331 280" /></svg>';
    const deferred = exporter.getData(testingMarkup, {});

    assert.expect(3);
    $.when(deferred).done(function(blob) {
        try {
            const $resultSvg = $(blob.arrayBuffer[0]);
            // assert
            assert.ok(blob, 'Blob was created');
            assert.deepEqual($resultSvg.html(), $(versionXML + testingMarkup).html(), 'Blob content is correct');
            assert.equal(blob.options.type, 'image/svg+xml', 'Blob type is correct');
        } finally {
            done();
        }
    });
});

QUnit.test('getData. markup with special symbols', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const testString = 'Temperature, °C';
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\'><text x="0" y="30" transform="translate(0,0)" text-anchor="middle" style="font-size:28px;font-family:\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana;font-weight:200;fill:#232323;cursor:default;">' + testString + '</text></svg>';
    const deferred = svgCreator.getData(testingMarkup, {});

    assert.expect(1);
    $.when(deferred).done(function(blob) {
        try {
            // assert
            assert.ok(blob.arrayBuffer[0].indexOf(testString) !== -1, 'Special symbols was added to result document');
        } finally {
            done();
        }
    });
});

QUnit.test('getData. markup with image', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const imageHtml = '<image xlink:href="../../testing/content/exporterTestsContent/test-image.png" width="300" height="200"></image>';
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;-ms-touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'>' + imageHtml + '</svg>';
    const deferred = svgCreator.getData(testingMarkup, {});

    assert.expect(1);
    $.when(deferred).done(function(blob) {
        try {
            // assert
            assert.ok(blob.arrayBuffer[0].indexOf('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1') !== -1, 'Image href was replaced on dataURI');
        } finally {
            done();
        }
    });
});

QUnit.test('getData. correct process two images with similar href', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const imageHtml = '<image xlink:href="../../testing/content/exporterTestsContent/test-image.png" width="300" height="200"></image><image xlink:href="../../testing/content/exporterTestsContent/test-image.png.png" width="300" height="200"></image>';
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;-ms-touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'>' + imageHtml + '</svg>';
    const deferred = svgCreator.getData(testingMarkup, {});

    assert.expect(2);
    $.when(deferred).done(function(blob) {
        try {
            // assert
            assert.ok(blob.arrayBuffer[0].indexOf('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j') !== -1);
            assert.ok(blob.arrayBuffer[0].indexOf('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2B') !== -1);
        } finally {
            done();
        }
    });
});

QUnit.test('getData. markup with image with href', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const imageHtml = '<image href="../../testing/content/exporterTestsContent/test-image.png" width="300" height="200"></image>';
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;-ms-touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'>' + imageHtml + '</svg>';
    const deferred = svgCreator.getData(testingMarkup, {});

    assert.expect(1);
    $.when(deferred).done(function(blob) {
        try {
            // assert
            assert.ok(blob.arrayBuffer[0].indexOf('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1') !== -1, 'Image href was replaced on dataURI');
        } finally {
            done();
        }
    });
});

QUnit.test('getData. markup with background-color', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;-ms-touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'><text>test</text></svg>';
    const deferred = svgCreator.getData(testingMarkup, { backgroundColor: '#aaa' });

    assert.expect(1);
    $.when(deferred).done(function(blob) {
        try {
            // assert
            assert.equal($(blob.arrayBuffer[0]).eq(1).css('background-color'), 'rgb(170, 170, 170)', 'Svg elementbackground color is correct');
        } finally {
            done();
        }
    });
});

QUnit.test('getData. markup with background-color. Source element hasn\'t background color', function(assert) {
    if(!checkForBlob.call(this, assert)) return;

    // arrange. act
    const done = assert.async();
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;-ms-touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'><text>test</text></svg>';
    const testingElement = svgUtils.getSvgElement(testingMarkup);
    const originalBackgroundColor = $(testingElement).css('backgroundColor');
    const deferred = svgCreator.getData(testingElement, { backgroundColor: '#aaa' });

    $.when(deferred).done(function() {
        assert.strictEqual($(testingElement).css('backgroundColor'), originalBackgroundColor);
        done();
    });
});

QUnit.test('getData returns base64 when blob is not supported', function(assert) {
    if(this.blobSupported) {
        assert.ok(true, 'Skip if there is blob');
        return;
    }

    // arrange. act
    let deferred;
    const done = assert.async();
    const _getBlob = svgCreator._getBlob;
    const _getBase64 = svgCreator._getBase64;
    const testingMarkup = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' fill=\'none\' stroke=\'none\' stroke-width=\'0\' class=\'dxc dxc-chart\' style=\'line-height:normal;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;overflow:hidden;touch-action:pan-x pan-y pinch-zoom;-ms-touch-action:pan-x pan-y pinch-zoom;\' width=\'500\' height=\'250\'><text>test</text></svg>';

    svgCreator._getBlob = function() {
        return 'blobData';
    };

    svgCreator._getBase64 = function() {
        return 'base64Data';
    };

    deferred = svgCreator.getData(testingMarkup, { backgroundColor: '#aaa' });

    assert.expect(1);
    $.when(deferred).done(function(data) {
        try {
            // assert
            assert.equal(data, 'base64Data', 'getBase64 was called');
        } finally {
            svgCreator._getBlob = _getBlob;
            svgCreator._getBase64 = _getBase64;
            done();
        }
    });
});
