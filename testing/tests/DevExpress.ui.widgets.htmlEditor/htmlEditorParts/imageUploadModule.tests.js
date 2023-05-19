import $ from 'jquery';
import ImageUpload from 'ui/html_editor/modules/imageUpload';

const { test } = QUnit;

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor').css({ margin: '10px' });
        this.$markup = $('<p>test text</p><p><br></p><p><img src="/uploadDirectory/fakefile1.jpeg"></p>').appendTo(this.$element);

        this.selectedRange = { index: 0, length: 0 };

        this.preventImageUpload = false;

        this.quillMock = {
            root: this.$element.get(0),
            on: (e) => {},
            off: (e) => {},
            uploader: {
                preventImageUploading: (value) => {
                    if(typeof value !== 'undefined') {
                        this.preventImageUpload = value;
                    }
                    return this.preventImageUpload;
                }
            },
            getModule: (moduleName) => this.quillMock[moduleName]
        };

        this.options = {
            _quillContainer: this.$markup,

            editorInstance: {
                on: () => {},
                off: () => {},
                $element: () => this.$element,
                addCleanCallback: () => {},
                _createComponent: ($element, widget, options) => new widget($element, options),
                _getContent: () => this.$element,
                _getQuillContainer: () => this.$element,
                option: () => {}
            }
        };

        this.attachSpies = (instance) => {
            this.attachEventsSpy = sinon.spy(instance, '_attachEvents');
            this.detachEventsSpy = sinon.spy(instance, '_detachEvents');
        };

    },
    afterEach: function() {
        this.clock.restore();
    }
};


moduleWithoutCsp('ImageUpload module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        assert.notOk(ImageUploadInstance._getUploaderModule().preventImageUploading());
    });

    test('create module instance with fileUploadMode = server', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        assert.ok(ImageUploadInstance._getUploaderModule().preventImageUploading());
    });

    test('events should be attached if the fileUploadMode is changed to base64 at runtime', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        this.attachSpies(ImageUploadInstance);
        ImageUploadInstance.option('fileUploadMode', 'base64');

        assert.notOk(ImageUploadInstance._getUploaderModule().preventImageUploading());
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'Events are attached');
        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached');
    });

    test('events should be attached if the fileUploadMode is changed to server at runtime', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        this.attachSpies(ImageUploadInstance);
        ImageUploadInstance.option('fileUploadMode', 'server');

        assert.ok(ImageUploadInstance._getUploaderModule().preventImageUploading());
        assert.strictEqual(this.attachEventsSpy.callCount, 1, 'Events are attached');
        assert.strictEqual(this.detachEventsSpy.callCount, 0, 'Events are detached');
    });

    test('events should be detached on clean', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        this.attachSpies(ImageUploadInstance);
        ImageUploadInstance.clean();

        assert.notOk(ImageUploadInstance._getUploaderModule().preventImageUploading());
        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached');
    });
});
