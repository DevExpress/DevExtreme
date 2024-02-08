import $ from 'jquery';

import 'ui/splitter';

QUnit.testStart(function() {
    const markup =
        '<div id="splitter"></div>';

    $('#qunit-fixture').html(markup);
});

const SPLITTER_CLASS = 'dx-splitter';
const PANE_SPLITTER_CLASS = 'dx-pane-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const HORIZONTAL_DIRECTION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-splitter-vertical';

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
    QUnit.test('Splitter should have dx-splitter and dx-pane-splitter classes', function(assert) {
        assert.strictEqual(this.$element.hasClass(SPLITTER_CLASS), true);
        assert.strictEqual(this.$element.hasClass(PANE_SPLITTER_CLASS), true);
    });

    QUnit.test('Splitter should be initialized with horizontal class by default', function(assert) {
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), true);
    });

    QUnit.test('Splitter direction should be initialized correctly', function(assert) {
        this.reinit({ direction: 'vertical' });

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), true);
    });

    QUnit.test('direction should be changed at runtime', function(assert) {
        this.instance.option('direction', 'vertical');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), true);

        this.instance.option('direction', 'horizontal');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), true);
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), false);
    });

    QUnit.test('Splitter should be initialized with pane', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });

        assert.strictEqual(this.$element.find(`.${SPLITTER_ITEM_CLASS}`).length, 1);
    });
});
