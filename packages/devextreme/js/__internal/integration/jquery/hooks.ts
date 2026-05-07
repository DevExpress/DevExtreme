import { each } from '@ts/core/utils/m_iterator';
import { isNumeric } from '@ts/core/utils/m_type';
import { compare as compareVersion } from '@ts/core/utils/m_version';
import registerEvent from '@ts/events/core/m_event_registrator';
import hookTouchProps from '@ts/events/core/m_hook_touch_props';
import { setEventFixMethod } from '@ts/events/utils/index';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  if (compareVersion(jQuery.fn.jquery, [3]) < 0) {
    const POINTER_TYPE_MAP = {
      2: 'touch',
      3: 'pen',
      4: 'mouse',
    };

    each([
      'MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel', 'MSPointerOver', 'MSPointerOut', 'mouseenter', 'mouseleave',
      'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave',
      // eslint-disable-next-line func-names
    ], function () {
      // @ts-expect-error
      jQuery.event.fixHooks[this] = {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        filter(event, originalEvent) {
          const { pointerType } = originalEvent;

          if (isNumeric(pointerType)) {
            event.pointerType = POINTER_TYPE_MAP[pointerType];
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return event;
        },
        // @ts-expect-error
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
          'prevValue',
        ]),
      };
    });

    each(['touchstart', 'touchmove', 'touchend', 'touchcancel'], function () {
      // @ts-expect-error
      jQuery.event.fixHooks[this] = {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        filter(event, originalEvent) {
          hookTouchProps((name, hook) => {
            event[name] = hook(originalEvent);
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return event;
        },

        // @ts-expect-error
        props: jQuery.event.mouseHooks.props.concat([
          'touches',
          'changedTouches',
          'targetTouches',
          'detail',
          'result',
          'originalTarget',
          'charCode',
          'prevValue',
        ]),
      };
    });

    // @ts-expect-error
    jQuery.event.fixHooks.wheel = jQuery.event.mouseHooks;

    const DX_EVENT_HOOKS = {
      // @ts-expect-error
      props: jQuery.event.mouseHooks.props.concat(['pointerType', 'pointerId', 'pointers']),
    };

    registerEvent.callbacks.add((name) => {
      // @ts-expect-error
      jQuery.event.fixHooks[name] = DX_EVENT_HOOKS;
    });

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fix = function (event, originalEvent) {
      // @ts-expect-error
      const fixHook = jQuery.event.fixHooks[originalEvent.type] || jQuery.event.mouseHooks;

      // @ts-expect-error
      const props = fixHook.props ? jQuery.event.props.concat(fixHook.props) : jQuery.event.props;
      let propIndex: number = props.length;

      // eslint-disable-next-line no-cond-assign
      while (propIndex -= 1) {
        const prop = props[propIndex];
        event[prop] = originalEvent[prop];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    };

    setEventFixMethod(fix);
  } else {
    hookTouchProps((name, hook) => {
      // @ts-expect-error
      jQuery.event.addProp(name, hook);
    });
  }
}
