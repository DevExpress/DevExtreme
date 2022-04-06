import $ from 'jquery';
import ImageUpload from 'ui/html_editor/modules/imageUpload';


const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor').css({ margin: '10px' });
        this.$table = $('<p>test text</p><p><br></p><p><img src="/uploadDirectory/fakefile1.jpeg"></p>').appendTo(this.$element);

        this.selectedRange = { index: 0, length: 0 };

        this.quillMock = {
            root: this.$element.get(0),
            on: (e) => {},
            off: (e) => {},
            uploader: { preventImageUpload: false },
            getModule: (moduleName) => this.quillMock[moduleName]
        };

        this.options = {
            _quillContainer: this.$table,

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

const { test, module } = QUnit;

module('ImageUpload module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        assert.notOk(ImageUploadInstance._getUploaderModule().preventImageUpload);
    });

    test('create module instance with fileUploadMode = server', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        assert.ok(ImageUploadInstance._getUploaderModule().preventImageUpload);
    });

    test('events should be attached if the fileUploadMode is changed to base64 at runtime', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        this.attachSpies(ImageUploadInstance);
        ImageUploadInstance.option('fileUploadMode', 'base64');

        assert.notOk(ImageUploadInstance._getUploaderModule().preventImageUpload);
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'Events are attached on module initialization at runtime');
    });

    test('events should be attached if the fileUploadMode is changed to server at runtime', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageUploadInstance = new ImageUpload(this.quillMock, this.options);

        this.attachSpies(ImageUploadInstance);
        ImageUploadInstance.option('fileUploadMode', 'server');

        assert.ok(ImageUploadInstance._getUploaderModule().preventImageUpload);
        assert.strictEqual(this.attachEventsSpy.callCount, 1, 'Events are attached on module initialization at runtime');
    });

    // after dispose
});
