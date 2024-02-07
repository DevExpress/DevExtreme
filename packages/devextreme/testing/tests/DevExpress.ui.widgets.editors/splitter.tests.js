import $ from 'jquery';
import Splitter from 'ui/splitter';
import fx from 'animation/fx';

QUnit.testStart(() => {
    const markup =
        '<div id="splitter"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.$element = $('#splitter').dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
        };

        init();
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Splitter Initialization', moduleConfig, () => {
    QUnit.test('Splitter should be initialized with correct type', function(assert) {
        assert.ok(this.instance instanceof Splitter);
    });

    QUnit.test('Splitter should be initialized with horizontal direction by default', function(assert) {
        assert.strictEqual(this.instance.option('direction'), 'horizontal');
    });
});
