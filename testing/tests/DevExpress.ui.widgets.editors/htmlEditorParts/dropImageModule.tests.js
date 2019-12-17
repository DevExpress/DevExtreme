import $ from 'jquery';

import DropImage from 'ui/html_editor/modules/dropImage';
import { createBlobFile } from '../../../helpers/fileHelper.js';
import browser from 'core/utils/browser';

const IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgZGT8DwABDQEDEkMQNQAAAABJRU5ErkJggg==';

class DropImageMock extends DropImage {
    _getImage(files, callback) {
        callback(IMAGE);
    }
}

const moduleConfig = {
    beforeEach: () => {
        this.$element = $('#htmlEditor');

        this.insertEmbedStub = sinon.stub();

        this.quillMock = {
            root: this.$element,
            getSelection: () => {
                return { index: 1, length: 1 };
            },
            insertEmbed: this.insertEmbedStub
        };

        this.file = createBlobFile('test', 80);

        this.options = {
            editorInstance: {
                NAME: 'dxHtmlEditor'
            }
        };
    }
};

const { test } = QUnit;

QUnit.module('DropImage module', moduleConfig, () => {
    test('insert image on drop', (assert) => {
        new DropImageMock(this.quillMock, this.options);

        const event = $.Event($.Event('drop', { dataTransfer: { files: [this.file] } }));
        this.$element.trigger(event);

        assert.ok(event.isDefaultPrevented(), 'Prevent default behavior');
        assert.equal(this.insertEmbedStub.callCount, 1, 'File inserted');
        assert.deepEqual(this.insertEmbedStub.lastCall.args, [1, 'extendedImage', IMAGE, 'user'], 'insert base64 image by user');
    });

    test('check file type', (assert) => {
        const dropImage = new DropImage(this.quillMock, this.options);

        const textFile = createBlobFile('test', 80, 'text/html');
        const unsupportedImage = createBlobFile('test', 80, 'image/psd');

        assert.ok(dropImage._isImage(this.file), 'PNG');
        assert.notOk(dropImage._isImage(textFile), 'Text');
        assert.notOk(dropImage._isImage(unsupportedImage), 'PSD is unsupported');
    });

    test('insert image on paste', (assert) => {
        const clock = sinon.useFakeTimers();
        new DropImageMock(this.quillMock, this.options);

        const event = $.Event($.Event('paste', {
            clipboardData: {
                items: [this.file],
                getData: (type) => type === 'text/html' ? false : true
            }
        }));
        this.$element.trigger(event);
        clock.tick();

        if(browser.mozilla) {
            assert.ok(true, 'FF handle this out-the-box');
        } else {
            assert.equal(this.insertEmbedStub.callCount, 1, 'File inserted');
            assert.deepEqual(this.insertEmbedStub.lastCall.args, [1, 'extendedImage', IMAGE, 'user'], 'insert base64 image by user');
        }

        clock.restore();
    });

    test('Do not encode pasted image with URL', (assert) => {
        new DropImageMock(this.quillMock, this.options);

        const textFile = createBlobFile('test', 80, 'text/html');
        const event = $.Event($.Event('paste', {
            clipboardData: {
                items: [this.file, textFile],
                getData: (type) => type === 'text/html' ? true : false
            }
        }));
        this.$element.trigger(event);

        assert.notOk(event.isDefaultPrevented(), 'Doesn\'t prevent default behavior');
        assert.equal(this.insertEmbedStub.callCount, 0, 'File isn\'t inserted');
    });

    test('dragover event', (assert) => {
        new DropImage(this.quillMock, this.options);

        const event = $.Event('dragover');
        this.$element.trigger(event);

        assert.equal(event.isDefaultPrevented(), !!browser.msie, 'It should be prevented for MS browsers');
    });
});
