var $ = require('jquery'),
    version = require('core/version'),
    getData = require('exporter').pdf.getData,
    pdfCreator = require('exporter/pdf_creator').__tests,
    isFunction = require('core/utils/type').isFunction,
    imageCreator = require('exporter/image_creator').imageCreator;

QUnit.module('PDF content test', {
    beforeEach: function() {
        pdfCreator.set_getBlob(function(data) { return data; });
        pdfCreator.set_getBase64(function(data) { return data; });
        pdfCreator.set_getCurDate(function() { return '_test_date_'; });
        var that = this;
        sinon.stub(imageCreator, 'getImageData', function(markup) { var def = $.Deferred(); def.resolve(that.imageDataSample || '_test_' + markup + '_string_'); return def; });
    },
    afterEach: function() {
        pdfCreator.restore_getBlob();
        pdfCreator.restore_getBase64();
        pdfCreator.restore_getCurDate();
        imageCreator.getImageData.restore();
    }
});

QUnit.test('PDF \'main page\' populated with correct size in pt', function(assert) {
    // arrange
    var done = assert.async();

    // act
    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        // assert
        assert.ok(data.indexOf('/MediaBox[0 0 465.08 315.15]/') !== -1);
    }).done(done);
});

QUnit.test('PDF \'content stream\' populated with correct size in pt', function(assert) {
    // arrange
    var done = assert.async();

    // act
    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        // assert
        assert.ok(data.indexOf('q 465.08 0 0 315.15 0.00 0.00 cm /I0 Do Q') !== -1);
        done();
    });
});

QUnit.test('PDF \'info\' has correct date and dx version', function(assert) {
    // arrange
    var done = assert.async();

    // act
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        // assert
        assert.ok(data.indexOf('/CreationDate _test_date_/Producer(DevExtreme ' + version + ')') !== -1);
        done();
    });
});

QUnit.test('PDF \'image\' populated with correct size in px, length and image string', function(assert) {
    // arrange
    var done = assert.async();
    // act
    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        // assert
        assert.ok(data.indexOf('/Image/Width 620.1/Height 420.2/') !== -1);
        assert.ok(data.indexOf('/Length 26>>stream\r\n_test_image_markup_string_\r\n') !== -1);
        done();
    });
});

QUnit.test('PDF \'image\' does not contain artifacts. T443241', function(assert) {
    // arrange
    var done = assert.async();
    this.imageDataSample = '$`';
    // act
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        // assert
        assert.ok(data.indexOf('<</Type/XObject/Subtype/Image/Width') === data.lastIndexOf('<</Type/XObject/Subtype/Image/Width'));
        done();
    });
});

QUnit.test('PDF \'startxref\' populated with correct offset', function(assert) {
    // arrange
    var done = assert.async();
    // act
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        // assert
        var match = data.match(/startxref\r\n(\d+)\r\n/);
        assert.ok(match);
        assert.strictEqual(match.length, 2);
        assert.strictEqual(parseInt(match[1]), 707 + version.length);
        done();
    });
});

QUnit.test('PDF \'xref\' populated with correct blocks offset', function(assert) {
    // arrange
    var done = assert.async();
    // act
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        // assert
        var match = data.match(/xref\r\n0 8\r\n0000000000 65535 f\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\ntrailer/);

        assert.ok(match);

        assert.strictEqual(match.length, 8);
        assert.strictEqual(parseInt(match[1]), 241, '1');
        assert.strictEqual(parseInt(match[2]), 10, '2');
        assert.strictEqual(parseInt(match[3]), 346, '3');
        assert.strictEqual(parseInt(match[4]), 89, '4');
        assert.strictEqual(parseInt(match[5]), 520 + version.length, '5');
        assert.strictEqual(parseInt(match[6]), 450, '6');
        assert.strictEqual(parseInt(match[7]), 143, '7');

        done();
    });
});

QUnit.module('Export', {
    beforeEach: function() {
        pdfCreator.set_composePdfString(function() { return '_composed_string_'; });

        sinon.stub(imageCreator, 'getImageData', function(markup) { var def = $.Deferred(); def.resolve(''); return def; });

        if(isFunction(window.Blob)) {
            this.Blob = window.Blob;
            window.Blob = sinon.spy();
        } else {
            this.btoa = window.btoa;
            window.btoa = sinon.spy(function() { return 'base64Data'; });
        }
    },
    afterEach: function() {
        pdfCreator.restore_composePdfString();
        imageCreator.getImageData.restore();
        if(isFunction(window.Blob)) {
            window.Blob = this.Blob;
        } else {
            window.btoa = this.btoa;
        }
    }
});

QUnit.test('pass correct options to imageCreator', function(assert) {
    // arrange
    var done = assert.async();
    // act
    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        // assert
        assert.deepEqual(imageCreator.getImageData.lastCall.args, ['image_markup', { width: 600.1, height: 400.2, margin: 10, format: 'JPEG' }]);
        done();
    });
});

QUnit.test('getData returns Blob when it is supported by Browser', function(assert) {
    if(!isFunction(window.Blob)) {
        assert.ok(true, 'Skip if there isn\'t blob');
        return;
    }

    // arrange
    var done = assert.async();
    // act
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        // assert
        assert.equal(window.Blob.callCount, 1);
        assert.equal(window.Blob.calledWithNew(), true);
        assert.ok(window.Blob.lastCall.args[0][0] instanceof ArrayBuffer);
        assert.deepEqual(new Uint8Array(window.Blob.lastCall.args[0][0]), new Uint8Array([95, 99, 111, 109, 112, 111, 115, 101, 100, 95, 115, 116, 114, 105, 110, 103, 95])); // _composed_string_
        assert.deepEqual(window.Blob.lastCall.args[1], { type: 'application/pdf' });
        assert.equal(data, window.Blob.lastCall.returnValue);
        done();
    });
});

QUnit.test('getData returns Base64 when Blob is not supported by Browser', function(assert) {
    if(isFunction(window.Blob)) {
        assert.ok(true, 'Skip if there is Blob');
        return;
    }

    // arrange
    var done = assert.async();
    // act
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        // assert
        assert.equal(window.btoa.callCount, 1);
        assert.deepEqual(window.btoa.lastCall.args, ['_composed_string_']);
        assert.equal(data, 'base64Data');
        done();
    });
});
