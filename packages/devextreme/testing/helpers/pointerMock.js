(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.pointerMock = module.exports = factory(
                require('jquery'),
                require('inferno'),
                require('common/core/events/gesture/emitter.gesture'),
                require('common/core/events/click'));
        });
    } else {
        root.pointerMock = factory(jQuery, DevExpress.events.GestureEmitter, DevExpress.events.click);
    }
}(window, function($, inferno, GestureEmitter, clickEvent) {

    GestureEmitter.touchBoundary(0);

    return function($element) {

        $element = $($element);

        let _x;
        let _y;
        let _scrollTop;
        let _scrollLeft;
        let _clock;
        let _shiftKey;
        let _cancelable;
        let _pointerType = 'mouse';
        let _lastEvent;

        const triggerEvent = function(type, args) {
            const event = $.Event(
                $.extend($.Event(type), { timeStamp: _clock }),
                $.extend({
                    timeStamp: _clock,
                    pageX: _x,
                    pageY: _y,
                    which: 1,
                    shiftKey: _shiftKey,
                    cancelable: _cancelable,
                    target: $element.get(0),
                    pointerType: _pointerType,
                    pointers: []
                }, args));

            $(event.delegatedTarget || event.target).trigger(event);

            _lastEvent = event;

            return event;
        };

        return {
            start: function(params) {
                if($.isPlainObject(params)) {
                    _x = params.x;
                    _y = params.y;
                    _scrollTop = params.scrollTop || 0;
                    _scrollLeft = params.scrollLeft || 0;
                    _clock = params.clock || $.now();
                    _shiftKey = params.shiftKey || false;
                    _cancelable = params.cancelable;
                    _pointerType = params.pointerType || _pointerType;
                } else {
                    _x = 0;
                    _y = 0;
                    _scrollTop = 0;
                    _scrollLeft = 0;
                    _clock = $.now();
                    _shiftKey = false;
                    _pointerType = params || _pointerType;
                }

                return this;
            },

            down: function(x, y) {
                _x = x || _x;
                _y = y || _y;

                triggerEvent('dxpointerdown', {
                    pointers: [{ pointerId: 1 }]
                });

                return this;
            },

            move: function(x, y) {
                if($.isArray(x)) {
                    this.move.apply(this, x);
                } else {
                    _x += x || 0;
                    _y += y || 0;

                    triggerEvent('dxpointermove', {
                        pointers: [{ pointerId: 1 }]
                    });
                }

                // eslint-disable-next-line spellcheck/spell-checker
                inferno.rerender();
                return this;
            },

            up: function() {
                let requestAnimationFrameCallback = function() {};
                if(clickEvent.misc) {
                    clickEvent.misc.requestAnimationFrame = function(callback) { requestAnimationFrameCallback = callback; };
                }

                triggerEvent('dxpointerup');
                requestAnimationFrameCallback();

                this.nativeClick();
                // eslint-disable-next-line spellcheck/spell-checker
                inferno.rerender();

                return this;
            },

            cancel: function() {
                triggerEvent('dxpointercancel');

                return this;
            },

            click: function(clickOnly) {
                if(!clickOnly) {
                    this.down();
                    this.up();
                } else {
                    triggerEvent('dxclick');
                }
                return this;
            },

            nativeClick: function() {
                triggerEvent('click');
            },

            wheel: function(d, args) {
                triggerEvent('dxmousewheel', $.extend({
                    delta: d
                }, args));
                triggerEvent('scroll');

                // eslint-disable-next-line spellcheck/spell-checker
                inferno.rerender();

                return this;
            },

            scroll: function(x, y) {
                _scrollLeft += x;
                _scrollTop += y;

                $element
                    .scrollLeft(_scrollLeft)
                    .scrollTop(_scrollTop);
                return this;
            },

            wait: function(ms) {
                _clock += ms;
                return this;
            },

            swipeStart: function() {
                triggerEvent('dxswipestart');
                return this;
            },

            swipe: function(offset) {
                triggerEvent('dxswipe', {
                    offset: offset
                });

                return this;
            },

            swipeEnd: function(targetOffset, offset) {
                triggerEvent('dxswipeend', {
                    offset: offset,
                    targetOffset: targetOffset
                });

                return this;
            },

            dragStart: function(args) {
                triggerEvent('dxdragstart', args);

                return this;
            },

            drag: function(x, y) {
                _x += x || 0;
                _y += y || 0;

                triggerEvent('dxdrag', {
                    offset: {
                        x: _x,
                        y: _y
                    }
                });

                return this;
            },

            dragEnd: function() {
                triggerEvent('dxdragend', {
                    offset: {
                        x: _x,
                        y: _y
                    }
                });

                return this;
            },

            lastEvent: function() {
                return _lastEvent;
            },

            active: function(target) {
                triggerEvent('dxactive', { delegatedTarget: $(target).get(0) });

                return this;
            },

            inactive: function(target) {
                triggerEvent('dxinactive', { delegatedTarget: $(target).get(0) });

                return this;
            }
        };
    };
}));
