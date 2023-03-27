import $ from 'jquery';
import { version } from 'core/version';
import * as exporter from 'exporter' ;
import { __tests as pdfCreator } from 'exporter/pdf_creator';
import { isFunction } from 'core/utils/type';
import { imageCreator } from 'exporter/image_creator';
import { getWindow } from 'core/utils/window';

const getData = exporter.pdf.getData;
const window = getWindow();
const ASN_DATE_REGEX = /CreationDate\s\(D:([0-9]+)Z([0-9]+)'([0-9]+)'/;

const contentTestEnv = {
    beforeEach: function() {
        pdfCreator.set_getBlob(function(data) { return data; });
        pdfCreator.set_getBase64(function(data) { return data; });
        sinon.stub(imageCreator, 'getImageData', (markup) => {
            const def = $.Deferred();
            def.resolve(this.imageDataSample || '_test_' + markup + '_string_');
            return def; 
        });
    },
    afterEach: function() {
        pdfCreator.restore_getBlob();
        pdfCreator.restore_getBase64();
        imageCreator.getImageData.restore();
    }
};

QUnit.module('PDF content test', contentTestEnv);

QUnit.test('PDF \'main page\' populated with correct size in pt', function(assert) {
    const done = assert.async();

    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        assert.notStrictEqual(data.indexOf('/MediaBox[0 0 465.08 315.15]/'), -1);
    }).done(done);
});

QUnit.test('PDF \'content stream\' populated with correct size in pt', function(assert) {
    const done = assert.async();

    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        assert.notStrictEqual(data.indexOf('q 465.08 0 0 315.15 0.00 0.00 cm /I0 Do Q'), -1);
        done();
    });
});

QUnit.test('PDF \'info\' has correct dx version', function(assert) {
    const done = assert.async();

    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        assert.notStrictEqual(data.indexOf('/Producer(DevExtreme ' + version + ')'), -1, 'version is valid');
        done();
    });
});

QUnit.test('PDF \'image\' populated with correct size in px, length and image string', function(assert) {
    const done = assert.async();
    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        assert.notStrictEqual(data.indexOf('/Image/Width 620/Height 420/'), -1);
        assert.notStrictEqual(data.indexOf('/Length 26>>stream\r\n_test_image_markup_string_\r\n'), -1);
        done();
    });
});

QUnit.test('PDF \'image\' does not contain artifacts. T443241', function(assert) {
    const done = assert.async();
    this.imageDataSample = '$`';
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        assert.strictEqual(data.indexOf('<</Type/XObject/Subtype/Image/Width'), data.lastIndexOf('<</Type/XObject/Subtype/Image/Width'));
        done();
    });
});

QUnit.test('PDF \'startxref\' populated with correct offset', function(assert) {
    const done = assert.async();
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        const match = data.match(/startxref\r\n(\d+)\r\n/);
        assert.ok(match);
        assert.strictEqual(match.length, 2);
        assert.strictEqual(parseInt(match[1]), 717 + version.length);
        done();
    });
});

QUnit.test('PDF \'xref\' populated with correct blocks offset', function(assert) {
    const done = assert.async();
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        const match = data.match(/xref\r\n0 8\r\n0000000000 65535 f\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\n0000000(\d\d\d) 00000 n\r\ntrailer/);

        assert.ok(match);

        assert.strictEqual(match.length, 8);
        assert.strictEqual(parseInt(match[1]), 241, '1');
        assert.strictEqual(parseInt(match[2]), 10, '2');
        assert.strictEqual(parseInt(match[3]), 346, '3');
        assert.strictEqual(parseInt(match[4]), 89, '4');
        assert.strictEqual(parseInt(match[5]), 534 + version.length, '5');
        assert.strictEqual(parseInt(match[6]), 450, '6');
        assert.strictEqual(parseInt(match[7]), 143, '7');

        done();
    });
});

QUnit.module('PDF content size. Scaled screen', {
    beforeEach() {
        contentTestEnv.beforeEach.apply(this, arguments);
        this.srcDevicePixelRatio = window.devicePixelRatio;
        window.devicePixelRatio = 2;
    },
    afterEach() {
        contentTestEnv.afterEach.apply(this, arguments);
        window.devicePixelRatio = this.srcDevicePixelRatio;
    }
});

QUnit.test('PDF \'main page\' populated with correct size in pt', function(assert) {
    const done = assert.async();

    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        assert.notStrictEqual(data.indexOf('/MediaBox[0 0 915.15 615.30]/'), -1);
    }).done(done);
});

QUnit.test('PDF \'content stream\' populated with correct size in pt', function(assert) {
    const done = assert.async();

    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        assert.notStrictEqual(data.indexOf('q 915.15 0 0 615.30 0.00 0.00 cm /I0 Do Q'), -1);
        done();
    });
});

QUnit.module('Export', {
    beforeEach: function() {
        pdfCreator.set_composePdfString(function() { return '_composed_string_'; });

        sinon.stub(imageCreator, 'getImageData', function(markup) { const def = $.Deferred(); def.resolve(''); return def; });

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
    const done = assert.async();
    getData('image_markup', { width: 600.1, height: 400.2, margin: 10 }).then(function(data) {
        assert.deepEqual(imageCreator.getImageData.lastCall.args, ['image_markup', { width: 600.1, height: 400.2, margin: 10, format: 'JPEG' }]);
        done();
    });
});

QUnit.test('getData returns Blob when it is supported by Browser', function(assert) {
    if(!isFunction(window.Blob)) {
        assert.ok(true, 'Skip if there isn\'t blob');
        return;
    }

    const done = assert.async();
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
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

    const done = assert.async();
    getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
        assert.equal(window.btoa.callCount, 1);
        assert.deepEqual(window.btoa.lastCall.args, ['_composed_string_']);
        assert.equal(data, 'base64Data');
        done();
    });
});

QUnit.module('PDF CreationDate', {
    beforeEach() {
        contentTestEnv.beforeEach.apply(this, arguments);
        pdfCreator.set_getCurDate(() => this.currentDate);

    },
    afterEach() {
        contentTestEnv.afterEach.apply(this, arguments);
        pdfCreator.restore_getCurDate();
    }
}, () => {

    QUnit.test('PDF \'info\' has correct date. Date units less 10', function(assert) {
        const done = assert.async();
        this.currentDate = new Date('Tue Feb 02 2021 06:04:01 GMT+0400');

        getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
            const matches = data.match(ASN_DATE_REGEX);

            assert.strictEqual(matches.length, 4, 'matches count is valid');
            assert.strictEqual(matches[1], '20210102020401', 'date is valid');
            assert.strictEqual(matches[2], '00', 'time should be in UTC format');
            assert.strictEqual(matches[3], '00', 'time should be in UTC format');

            done();
        });
    });

    QUnit.test('PDF \'info\' has correct date. Date units great 10', function(assert) {
        const done = assert.async();
        this.currentDate = new Date('Tue Dec 11 2021 21:12:13 GMT+0400');

        getData('image_markup', { width: 600.1, height: 400.2 }).then(function(data) {
            const matches = data.match(ASN_DATE_REGEX);

            assert.strictEqual(matches.length, 4, 'matches count is valid');
            assert.strictEqual(matches[1], '20211111171213', 'date is valid');
            assert.strictEqual(matches[2], '00', 'time should be in UTC format');
            assert.strictEqual(matches[3], '00', 'time should be in UTC format');

            done();
        });
    });
});
