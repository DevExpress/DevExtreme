import $ from 'jquery';

import 'ui/splitter';

QUnit.testStart(function() {
    const markup =
        '<div id="splitter"></div>';

    $('#qunit-fixture').html(markup);
});

const SPLITTER_CLASS = 'dx-splitter';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#splitter').dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
        };

        init();
    }
};

QUnit.module('Splitter markup', moduleConfig, () => {
    QUnit.test('Splitter should have dx-splitter class', function(assert) {
        assert.strictEqual(this.$element.hasClass(SPLITTER_CLASS), true);
    });
});
