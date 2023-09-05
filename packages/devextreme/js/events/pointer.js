import * as support from '../core/utils/support';
import { each } from '../core/utils/iterator';
import devices from '../core/devices';
import registerEvent from './core/event_registrator';
// import TouchStrategy from './pointer/touch';
// import MouseStrategy from './pointer/mouse';
import MouseAndTouchStrategy from './pointer/mouse_and_touch';

/**
  * @name UI Events.dxpointerdown
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointermove
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointerup
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointercancel
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointerover
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointerout
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointerenter
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name UI Events.dxpointerleave
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/

const getStrategy = (support, device) => {
    return MouseAndTouchStrategy;

    // const { tablet, phone } = device;
    // if(support.touch && !(tablet || phone)) {
    // }

    // if(support.touch) {
    //     return TouchStrategy;
    // }

    // return MouseStrategy;
};

const EventStrategy = getStrategy(support, devices.real());

each(EventStrategy.map, (pointerEvent, originalEvents) => {
    registerEvent(pointerEvent, new EventStrategy(pointerEvent, originalEvents));
});

const pointer = {
    down: 'dxpointerdown',
    up: 'dxpointerup',
    move: 'dxpointermove',
    cancel: 'dxpointercancel',
    enter: 'dxpointerenter',
    leave: 'dxpointerleave',
    over: 'dxpointerover',
    out: 'dxpointerout'
};

///#DEBUG
pointer.getStrategy = getStrategy;

///#ENDDEBUG

export default pointer;
