import $ from 'jquery';

import 'ui/card_view';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="cardView"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('CardView markup', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('markup init', function(assert) {
        const $element = $('#cardView').dxCardView({ dataSource: [{ a: 1 }, { a: 2 }] });

        assert.ok($element.hasClass('dx-widget'), 'dx-widget');
        assert.ok($element.hasClass('dx-cardview'), 'dx-cardview');
    });
});

