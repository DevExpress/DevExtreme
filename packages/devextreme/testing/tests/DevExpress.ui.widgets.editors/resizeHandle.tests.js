import $ from 'jquery';
import fx from 'animation/fx';
import ResizeHandle from '../../../js/ui/resize_handle';

QUnit.testStart(() => {
    const markup =
        '<div id="resizehandle"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            const resizeHandle = new ResizeHandle($('<div>').appendTo('#resizehandle'));

            // this.$element = $('#resizehandle').dxSplitter(options);
            this.instance = resizeHandle;
        };

        init();
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('ResizeHandle should be initialized with correct type', function(assert) {
        assert.ok(this.instance instanceof ResizeHandle);
    });

    QUnit.test('ResizeHandle  should be initialized with horizontal direction by default', function(assert) {
        assert.strictEqual(this.instance.option('direction'), 'horizontal');
    });
});
