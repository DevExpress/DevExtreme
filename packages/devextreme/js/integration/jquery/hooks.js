// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import useJQueryFn from './use_jquery';
const useJQuery = useJQueryFn();
import { compare as compareVersion } from '../../core/utils/version';
import { each } from '../../core/utils/iterator';
import { isNumeric } from '../../core/utils/type';
import { setEventFixMethod } from '../../common/core/events/utils/index';
import registerEvent from '../../common/core/events/core/event_registrator';
import hookTouchProps from '../../common/core/events/core/hook_touch_props';

if(useJQuery) {
    if(compareVersion(jQuery.fn.jquery, [3]) < 0) {
        const POINTER_TYPE_MAP = {
            2: 'touch',
            3: 'pen',
            4: 'mouse'
        };

        each([
            'MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel', 'MSPointerOver', 'MSPointerOut', 'mouseenter', 'mouseleave',
            'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave'
        ], function() {
            jQuery.event.fixHooks[this] = {
                filter: function(event, originalEvent) {
                    const pointerType = originalEvent.pointerType;

                    if(isNumeric(pointerType)) {
                        event.pointerType = POINTER_TYPE_MAP[pointerType];
                    }

                    return event;
                },
                props: jQuery.event.mouseHooks.props.concat([
                    'pointerId',
                    'pointerType',
                    'originalTarget',
                    'width',
                    'height',
                    'pressure',
                    'result',
                    'tiltX',
                    'charCode',
                    'tiltY',
                    'detail',
                    'isPrimary',
                    'prevValue'
                ])
            };
        });

        each(['touchstart', 'touchmove', 'touchend', 'touchcancel'], function() {
            jQuery.event.fixHooks[this] = {
                filter: function(event, originalEvent) {
                    hookTouchProps(function(name, hook) {
                        event[name] = hook(originalEvent);
                    });

                    return event;
                },

                props: jQuery.event.mouseHooks.props.concat([
                    'touches',
                    'changedTouches',
                    'targetTouches',
                    'detail',
                    'result',
                    'originalTarget',
                    'charCode',
                    'prevValue'
                ])
            };
        });

        jQuery.event.fixHooks['wheel'] = jQuery.event.mouseHooks;

        const DX_EVENT_HOOKS = {
            props: jQuery.event.mouseHooks.props.concat(['pointerType', 'pointerId', 'pointers'])
        };

        registerEvent.callbacks.add(function(name) {
            jQuery.event.fixHooks[name] = DX_EVENT_HOOKS;
        });

        const fix = function(event, originalEvent) {
            const fixHook = jQuery.event.fixHooks[originalEvent.type] || jQuery.event.mouseHooks;

            const props = fixHook.props ? jQuery.event.props.concat(fixHook.props) : jQuery.event.props;
            let propIndex = props.length;

            while(propIndex--) {
                const prop = props[propIndex];
                event[prop] = originalEvent[prop];
            }

            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        };

        setEventFixMethod(fix);
    } else {
        hookTouchProps(function(name, hook) {
            jQuery.event.addProp(name, hook);
        });
    }
}
