var focused;

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            focused = require('ui/widget/selectors').focused;
            root.keyboardMock = module.exports = factory(require('jquery'));
        });
    } else {
        focused = DevExpress.require('ui/widget/selectors').focused;
        root.keyboardMock = factory(root.jQuery);
    }
}(window, function($) {
    var $element;

    var caret;

    var caretMock = {
        getPosition: function() {
            return $element.data('dxCaretPosition') || { start: 0, end: 0 };
        },

        setPosition: function(position) {
            position = $.isPlainObject(position) ? position : { start: position || 0, end: position || 0 };
            var start = position.start;
            var end = position.end;
            var textLength = $element.val().length;

            if(start < 0) {
                start = 0;
            }
            if(end < 0 || end > textLength) {
                end = textLength;
            }
            if(start > end) {
                start = end;
            }

            $element.data('dxCaretPosition', { start: start, end: end });
        }
    };

    var nativeCaretMock = {
        getPosition: function() {
            var start = 0;
            var end = 0;
            var input = $element.get(0);

            if(!input.setSelectionRange) {
                var range = document.selection.createRange();
                var rangeCopy = range.duplicate();
                range.move('character', -input.value.length);
                range.setEndPoint('EndToStart', rangeCopy);
                start = range.text.length;
                end = start + rangeCopy.text.length;
            } else {
                try {
                    start = input.selectionStart;
                    end = input.selectionEnd;
                } catch(e) {
                }
            }
            return { start: start, end: end };
        },

        setPosition: function(position) {
            position = $.isPlainObject(position) ? position : { start: position || 0, end: position || 0 };
            var input = $element.get(0);
            var start = position.start;
            var end = position.end;
            var textLength = input.value.length;

            if(start < 0) {
                start = 0;
            }
            if(end < 0) {
                end = 0;
            }
            if(end > textLength) {
                end = textLength;
            }
            if(start > end) {
                start = end;
            }

            try {
                if(!input.setSelectionRange) {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', start);
                    range.moveEnd('character', end - start);
                    range.select();
                } else {
                    input.setSelectionRange(start, end);
                }
            } catch(e) { }
        }
    };

    var KEYS_MAPS = {
        SPECIAL_KEYS: {
            'backspace': 'Backspace',
            'tab': 'Tab',
            'enter': 'Enter',
            'esc': 'Escape',
            'space': ' ',
            'pageup': 'PageUp',
            'pagedown': 'PageDown',
            'end': 'End',
            'home': 'Home',
            'left': 'ArrowLeft',
            'up': 'ArrowUp',
            'right': 'ArrowRight',
            'down': 'ArrowDown',
            'ins': 'Insert',
            'del': 'Delete'
        },

        SHIFT_MAP: {
            '~': '`',
            '!': '1',
            '@': '2',
            '#': '3',
            '$': '4',
            '%': '5',
            '^': '6',
            '&': '7',
            '*': '8',
            '(': '9',
            ')': '0',
            '_': '-',
            '+': '=',
            '{': '[',
            '}': ']',
            ':': ';',
            '"': '"',
            '|': '\\',
            '<': ',',
            '>': '.',
            '?': '/'
        }
    };

    var DEFAULT_OPTIONS = {
        timeStamp: 0,
        which: undefined,
        keyCode: undefined,
        keyChar: undefined
    };

    var isEditableElement = function() {
        var editableInputTypesRE = /^(date|datetime|datetime-local|email|month|number|password|search|tel|text|time|url|week)$/;
        return $element.is('input') && editableInputTypesRE.test($element.prop('type')) || $element.is('textarea') || ($element.prop('tabindex') >= 0);
    };

    var deleteSelection = function() {
        var caretPosition = caret.getPosition(),
            value = $element.val();

        $element.val(value.slice(0, caretPosition.start) + value.slice(caretPosition.end, value.length));
        caret.setPosition(caretPosition.start);
    };

    var typeChar = function(character) {
        if($element.prop('readonly') || $element.prop('disabled')) {
            return;
        }

        deleteSelection();

        var value = $element.val(),
            caretPosition = caret.getPosition().start;

        $element.val(value.substring(0, caretPosition) + character + value.substring(caretPosition, value.length));
        caret.setPosition(caretPosition + 1);
    };

    var backspace = function() {
        var caretPosition = caret.getPosition(),
            caretStartPosition = caretPosition.start,
            value = $element.val();

        if(caretPosition.start !== caretPosition.end) {
            deleteSelection();
        } else if(caretStartPosition > 0) {
            $element.val(value.substring(0, caretStartPosition - 1) + value.substring(caretStartPosition, value.length));
            caret.setPosition(caretStartPosition - 1);
        }

        return 'deleteContentBackward';
    };

    var del = function() {
        var caretPosition = caret.getPosition(),
            caretStartPosition = caretPosition.start,
            value = $element.val();

        if(caretPosition.start !== caretPosition.end) {
            deleteSelection();
        } else if(caretStartPosition < value.length) {
            $element.val(value.substring(0, caretStartPosition) + value.substring(caretStartPosition + 1, value.length));
            caret.setPosition(caretStartPosition);
        }
    };

    var left = function() {
        var rtlCorrection = $element.css('direction') === 'rtl' ? -1 : 1;
        caret.setPosition(caret.getPosition().start - 1 * rtlCorrection);
    };

    var right = function() {
        var rtlCorrection = $element.css('direction') === 'rtl' ? -1 : 1;
        caret.setPosition(caret.getPosition().start + 1 * rtlCorrection);
    };

    var home = function() {
        caret.setPosition(0);
    };

    var end = function() {
        caret.setPosition($element.val().length);
    };

    var shortcuts = {
        'backspace': backspace,
        'del': del,
        'left': left,
        'right': right,
        'home': home,
        'end': end
    };

    var eventMock = function(type, options) {
        return $.extend(true, $.Event(type), DEFAULT_OPTIONS, options);
    };

    return function(element, useNativeSelection) {
        $element = $(element);

        caret = useNativeSelection ? nativeCaretMock : caretMock;

        if(!isEditableElement()) {
            throw Error('Unable to type text in non-editable element: ' + $element.get(0));
        }

        var clock = $.now();

        return {
            triggerEvent: function(eventName, options) {
                this.event = eventMock(eventName, $.extend({
                    timeStamp: clock
                }, options));
                $element.trigger(this.event);
            },

            keyDown: function(rawKey, options) {
                var isKeyCodeString = typeof rawKey === 'string',
                    isCommandKey = rawKey && rawKey.length > 1 || !isKeyCodeString,
                    key = isCommandKey && KEYS_MAPS.SPECIAL_KEYS[rawKey] ? KEYS_MAPS.SPECIAL_KEYS[rawKey] : rawKey;


                this.triggerEvent('keydown', $.extend({ key: key }, options));
                return this;
            },

            keyPress: function(rawKey) {
                var isKeyCodeString = typeof rawKey === 'string',
                    isCommandKey = rawKey && rawKey.length > 1 || !isKeyCodeString,
                    key = isCommandKey && KEYS_MAPS.SPECIAL_KEYS[rawKey] ? KEYS_MAPS.SPECIAL_KEYS[rawKey] : rawKey;

                // key = rawKey;
                this.triggerEvent('keypress', { key: key });
                return this;
            },

            beforeInput: function(data, inputType) {
                var params = { data: data };

                if(inputType !== null) {
                    params.originalEvent = $.Event('beforeinput', { data: data, inputType: inputType || 'insertText' });
                }

                this.triggerEvent('beforeinput', params);
                return this;
            },

            input: function(data, inputType) {
                var params = { data: data };

                if(inputType !== null) {
                    params.originalEvent = $.Event('input', { data: data, inputType: inputType || 'insertText' });
                }

                this.triggerEvent('input', params);
                return this;
            },

            keyUp: function(rawKey) {
                var isKeyCodeString = typeof rawKey === 'string',
                    isCommandKey = rawKey && rawKey.length > 1 || !isKeyCodeString,
                    key = isCommandKey && KEYS_MAPS.SPECIAL_KEYS[rawKey] ? KEYS_MAPS.SPECIAL_KEYS[rawKey] : rawKey;

                this.triggerEvent('keyup', { key: key });
                return this;
            },

            change: function() {
                this.triggerEvent('change');
                return this;
            },

            focus: function() {
                !focused($element) && this.triggerEvent('focus');
                return this;
            },

            blur: function() {
                this.triggerEvent('blur');
                return this;
            },

            wait: function(ms) {
                clock += ms;
                return this;
            },

            press: function(keysString, actionCallback) {
                this.focus();

                // NOTE: we should separate symbol "+" that concats other keys and key "+" to support commands like the "ctrl++"
                var keys = keysString.replace(/^\+/g, 'plus').replace(/\+\+/g, '+plus').split('+');

                $.map(keys, function(key, index) {
                    keys[index] = key.replace('plus', '+');
                });

                // NOTE: check "shift" modifier in keys
                for(var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if(key.toLowerCase() === 'shift') {
                        var nextKey = keys[i + 1];
                        if(!nextKey) {
                            continue;
                        }
                        if(KEYS_MAPS.SHIFT_MAP[nextKey]) {
                            keys[i + 1] = KEYS_MAPS.SHIFT_MAP[nextKey];
                        }
                    }

                    if(KEYS_MAPS.SHIFT_MAP[key] && (!keys[i - 1] || keys[i - 1].toLowerCase() !== 'shift')) {
                        keys[i] = KEYS_MAPS.SHIFT_MAP[key];
                        keys.splice(i, 0, 'shift');
                        i++;
                    }
                }


                var that = this;

                $.each(keys, function(index, key) {
                    var keyValue = key in KEYS_MAPS.SPECIAL_KEYS ? KEYS_MAPS.SPECIAL_KEYS[key] : key;

                    that.keyDown(keyValue);

                    if(!that.event.isDefaultPrevented()) {
                        that.keyPress(keyValue);
                        if(shortcuts[key]) {
                            var oldValue = $element.val();
                            that.beforeInput(data);
                            var inputType = shortcuts[key](element) || 'insertText';
                            var newValue = $element.val();
                            if(newValue !== oldValue) {
                                var data = inputType === 'deleteContentBackward' ? null : newValue;
                                that.input(data, inputType);
                            }
                        }
                    }

                    if(!that.event.isDefaultPrevented()) {
                        that.keyUp(keyValue);
                    }
                });

                return this;
            },

            caret: function(position) {
                if(position === undefined) {
                    return caret.getPosition();
                }
                this.focus();
                caret.setPosition(position);
                return this;
            },

            type: function(string) {
                this.focus();

                for(var i = 0; i < string.length; i++) {
                    var char = string.charAt(i);
                    this.keyDown(char);

                    if(!this.event.isDefaultPrevented()) {
                        this.keyPress(char);
                    }

                    if(!this.event.isDefaultPrevented()) {
                        this.beforeInput(char);
                        typeChar(char);
                        this.input(char);
                    }

                    this.keyUp(char);
                }

                return this;
            },

            paste: function(string) {
                this.triggerEvent('paste', { originalEvent: $.Event('paste', { clipboardData: { getData: function() { return string; } } }) });
                return this;
            }
        };
    };
}));
