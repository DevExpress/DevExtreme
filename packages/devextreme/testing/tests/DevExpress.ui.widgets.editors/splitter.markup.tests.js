import $ from 'jquery';

import 'ui/splitter';

QUnit.testStart(function() {
    const markup =
        '<div id="splitter"></div>';

    $('#qunit-fixture').html(markup);
});

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#splitter').dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
        };

        init();

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };
    }
};

QUnit.module('Splitter markup', moduleConfig, () => {
    QUnit.test('Splitter should have dx-splitter class', function(assert) {
        assert.strictEqual(this.$element.hasClass(SPLITTER_CLASS), true);
    });

    QUnit.test('Splitter should be initialized with horizontal class by default', function(assert) {
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('Splitter orientation should be initialized correctly', function(assert) {
        this.reinit({ orientation: 'vertical' });

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('orientation should be changed at runtime', function(assert) {
        this.instance.option('orientation', 'vertical');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), true);

        this.instance.option('orientation', 'horizontal');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), true);
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), false);
    });

    QUnit.test('Splitter should be initialized with pane', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });

        assert.strictEqual(this.$element.find(`.${SPLITTER_ITEM_CLASS}`).length, 1);
    });
});
