import $ from 'jquery';
import eventsEngine from 'common/core/events/core/events_engine';
import { removeEvent } from 'common/core/events/remove';

QUnit.testStart(function() {
    const markup = '<div id="element"><div id="inner"></div></div>';
    $('#qunit-fixture').html(markup);
});
QUnit.module('event firing');

QUnit.test('dxremove event should be fired on element removing', function(assert) {
    assert.expect(2);

    $('#element')
        .data('testData', true)
        .on(removeEvent, function(e) {
            assert.ok(e, 'dxremove fired');
            assert.ok($(e.target).data('testData'), 'element has data');
        });

    $('#element').remove();
});

QUnit.test('dxremove event should be fired for nested removing element', function(assert) {
    assert.expect(2);

    $('#inner')
        .data('testData', true)
        .on(removeEvent, function(e) {
            assert.ok(e, 'dxremove fired');
            assert.ok($(e.target).data('testData'), 'element has data');
        });

    $('#element').remove();
});

QUnit.test('dxremove event should not bubble', function(assert) {
    let counter = 0;
    $('#element').on(removeEvent, function() {
        counter++;
    });

    $('#inner').remove();
    assert.ok(!counter, 'dxremove handler should not be triggered for parent element');
});

QUnit.test('dxremove event should not triggers for element without any subscriptions', function(assert) {
    let counter = 0;
    const originalTriggerHandler = eventsEngine.triggerHandler;

    try {
        eventsEngine.triggerHandler = function() {
            counter++;
        };

        $('#element').remove();

        assert.equal(counter, 0, 'dxremove handler should be triggered once for each element');
    } finally {
        eventsEngine.triggerHandler = originalTriggerHandler;
    }
});

QUnit.test('dxremove event should be fired on all elements', function(assert) {
    $('#qunit-fixture').html('\
        <div class="item"></div>\
        <div class="item"></div>\
    ');

    let counter = 0;
    $('.item').on(removeEvent, function(e) {
        if(e.target.parentNode) {
            e.target.parentNode.removeChild(e.target);
        }
        counter++;
    });

    $('#qunit-fixture').empty();
    assert.equal(counter, 2, 'all elements removed');
});
