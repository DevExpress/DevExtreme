import $ from 'jquery';
import { noop } from 'core/utils/common';
import * as clickEvent from 'events/click';
import * as domUtils from 'core/utils/dom';
import * as support from 'core/utils/support';
import devices from 'core/devices';
import pointerMock from '../../helpers/pointerMock.js';
import nativePointerMock from '../../helpers/nativePointerMock.js';

QUnit.testStart(function() {
    const markup =
        '<div id="inputWrapper">\
            <input id="input" />\
        </div>\
        <div id="container">\
            <div id="element">\
                <div id="wrapper">\
                    <div><div id="first"></div></div>\
                    <div><div id="second"></div></div>\
                </div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        this.element = $('#element');
        this.container = $('#container');

        this.clock = sinon.useFakeTimers();

        this._originalAnimFrame = clickEvent.misc.requestAnimationFrame;
        clickEvent.misc.requestAnimationFrame = function(callback) {
            callback();
        };
    },
    afterEach: function() {
        this.clock.restore();
        clickEvent.misc.requestAnimationFrame = this._originalAnimFrame;
    }
};


QUnit.module('click handler', moduleConfig);

QUnit.test('event triggers', function(assert) {
    assert.expect(1);

    const $element = this.element.on('dxclick', function(e) {
        assert.ok(e);
    });

    pointerMock($element).start().down().up();
});

QUnit.test('event args', function(assert) {
    const fields = ['altKey', 'cancelable', 'clientX', 'clientY',
        'ctrlKey', 'currentTarget', 'data', 'delegateTarget',
        'isDefaultPrevented', 'metaKey', 'originalEvent',
        'pageX', 'pageY', 'screenX', 'screenY', 'shiftKey',
        'target', 'timeStamp', 'type', 'view', 'which'];

    const element = this.element.on('dxclick', function(e) {
        $.each(fields, function() {
            assert.ok(this in e, this);
        });
    });

    nativePointerMock(element).start().down().up();
});

QUnit.test('unsubscribing', function(assert) {
    assert.expect(0);

    const $element = this.element
        .on('dxclick', function(e) {
            assert.ok(e);
        })
        .off('dxclick');

    pointerMock($element).start().down().up();
});

QUnit.test('delegated handlers', function(assert) {
    assert.expect(1);

    this.container.on('dxclick', '#element', function(e) {
        assert.ok(e);
    });

    pointerMock(this.element).start().down().up();
});

QUnit.test('bubbling', function(assert) {
    assert.expect(4);

    this.container.on('dxclick', function(e) {
        assert.ok(e);
        assert.equal(e.type, 'dxclick');
    });

    this.element.on('dxclick', function(e) {
        assert.ok(e);
        assert.equal(e.type, 'dxclick');
    });

    this.element.trigger('dxclick');
});

QUnit.test('click subscription should not add onclick attr for native strategy (T527293)', function(assert) {
    this.element.on('dxclick', noop);
    assert.equal(this.element.attr('onclick'), undefined);
});


QUnit.module('prevent default', moduleConfig);

QUnit.test('pointer events should not be prevented', function(assert) {
    const $element = this.element;
    const pointer = nativePointerMock($element);

    $element.on('dxclick', noop);

    $.each(['mousedown', 'mouseup', 'touchstart', 'touchend'], function(_, eventName) {
        $element.on(eventName, function(e) {
            assert.ok(!e.isDefaultPrevented(), eventName + ' should not be prevented');
        });
    });

    pointer
        .start()
        .touchStart()
        .touchEnd()
        .mouseDown()
        .mouseUp();
});

QUnit.test('click should not be prevented (T131440, T131837)', function(assert) {
    const $element = this.element;

    $element.on('dxclick', function(e) {
        assert.ok(!e.originalEvent.isDefaultPrevented(), 'dxpointerup is not prevented');
    });

    nativePointerMock($element).click();
});


QUnit.module('reset active element', moduleConfig);

QUnit.test('native click should not focus on input after animation or scroll', function(assert) {
    if(devices.real().generic) {
        assert.ok(true);
        return;
    }

    const originalResetActiveElement = domUtils.resetActiveElement;

    try {
        const $element = this.element;
        const $input = $('#input');
        const pointer = nativePointerMock($element);
        let isMouseDownPrevented = false;
        let resetCount = 0;

        $element.on('dxclick', noop)
            .on('mousedown', function(e) {
                isMouseDownPrevented = e.isDefaultPrevented();
            });

        pointer
            .start()
            .touchStart()
            .touchEnd()
            .mouseDown()
            .mouseUp()
            .pointerDown()
            .pointerUp();

        domUtils.resetActiveElement = $.proxy(function() {
            resetCount++;
        }, this);

        // NOTE: after animation/scroll on real device input can be placed under pointer
        if(!isMouseDownPrevented) {
            $input.focus();
            $input.trigger('click');
        }

        assert.equal(resetCount, 1, 'input should not get focus after animation or scroll');
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test('native click should focus on input after animation or scroll if default action prevented', function(assert) {
    if(devices.real().generic) {
        assert.ok(true);
        return;
    }

    const originalResetActiveElement = domUtils.resetActiveElement;

    try {
        const $element = this.element;
        const $input = $('#input');
        const pointer = nativePointerMock($element);
        let isMouseDownPrevented = false;
        let resetCount = 0;

        $element.on({
            'dxclick': noop,
            'mousedown': function(e) {
                isMouseDownPrevented = e.isDefaultPrevented();
            },
            'dxpointerdown': function(e) {
                e.preventDefault();
            }
        });

        pointer
            .start()
            .touchStart()
            .touchEnd()
            .mouseDown()
            .mouseUp()
            .pointerDown()
            .pointerUp();

        domUtils.resetActiveElement = $.proxy(function() {
            resetCount++;
        }, this);

        // NOTE: after animation/scroll on real device input can be placed under pointer
        if(!isMouseDownPrevented) {
            $input.focus();
            $input.trigger('click');
        }

        assert.equal(resetCount, 0, 'input should get focus');
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test('native click should focus on input', function(assert) {
    const originalResetActiveElement = domUtils.resetActiveElement;

    try {
        const $input = $('#input');
        let resetCount = 0;

        domUtils.resetActiveElement = $.proxy(function() {
            resetCount++;
        }, this);

        $input.trigger('click');

        assert.equal(resetCount, 0, 'input should not get focus after animation or scroll');
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test('click on element should not prevent focus on mousedown if used native click (Q586100)', function(assert) {
    if(!support.touch) {
        assert.ok(true);
        return;
    }

    this.container.css({
        overflow: 'scroll',
        height: 100
    });

    this.element.css({
        height: 200
    });

    const $element = this.element;
    const pointer = nativePointerMock($element);
    let isDefaultPrevented = false;

    $element
        .on('dxclick', noop)
        .on('mousedown', function(e) {
            isDefaultPrevented = e.isDefaultPrevented();
        });

    pointer
        .start()
        .touchStart()
        .touchEnd()
        .mouseDown()
        .mouseUp()
        .click(true);

    assert.ok(!isDefaultPrevented, 'click on element should call preventDefault() on \'mousedown\' event');
});

QUnit.module('native click support');

QUnit.test('dxclick should be based on native click', function(assert) {
    assert.expect(1);

    const $element = $('#element');

    $element.on('dxclick', function() {
        assert.ok(true, 'dxclick present');
    });

    $element.trigger('click');
});

QUnit.test('dxclick should be based on native click for all devices', function(assert) {
    const $element = $('#element');
    let dxClickCallCount = 0;
    let dxClickChildCallCount = 0;

    $element.on('dxclick', { useNative: true }, function() {
        dxClickCallCount++;
    });

    const $childElement = $('<div>').on('dxclick', function() {
        dxClickChildCallCount++;
    }).appendTo($element);

    nativePointerMock($element).start().click();
    nativePointerMock($childElement).start().click();

    assert.equal(dxClickCallCount, 2, 'dxclick call count');
    assert.equal(dxClickChildCallCount, 1, 'dxclick child call count');
});

QUnit.test('dxclick should triggers only on left mouse button click', function(assert) {
    let triggered = 0;
    const $element = $('#element').on('dxclick', function(e) { triggered++; });


    $element.trigger($.Event('click', { which: 1 }));
    assert.equal(triggered, 1, 'left button click');

    $element.trigger($.Event('click', { which: 2 }));
    assert.equal(triggered, 1, 'middle button click');

    $element.trigger($.Event('click', { which: 3 }));
    assert.equal(triggered, 1, 'right button click');
});

QUnit.test('dxclick should not be fired twice after pointerdown, pointerup and click', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const pointer = pointerMock($element);

    $element.on('dxclick', function() {
        assert.ok(true, 'dxclick fired');
    });

    pointer.start().down().up();
});

QUnit.test('dxclick should be fired even if propagation was stopped', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const pointer = nativePointerMock($element);

    $element
        .on('dxclick', function() {
            assert.ok(true, 'dxclick fired');
        })
        .on('click', function(e) {
            e.stopPropagation();
        });

    pointer.start().down().up();
});

QUnit.test('dxclick should not be fired twice when \'click\' is triggered from its handler (T503035)', function(assert) {
    assert.expect(1);

    const $element = $('#element');
    const pointer = nativePointerMock($element);

    $(document).on('dxclick', $.noop);

    $element
        .on('dxclick', () => {
            $('#inputWrapper').trigger('click');
            assert.ok(true, 'dxclick fired');
        });

    pointer.start().down().up();
    $(document).off('dxclick', $.noop);
});
