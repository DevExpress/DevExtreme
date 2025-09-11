import { exportNames } from '../../../__internal/events/m_transform';

/**
 * @name UI Events.dxtransformstart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/transform
*/
/**
  * @name UI Events.dxtransform
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 rotation:number
  * @type_function_param1_field4 deltaRotation:number
  * @type_function_param1_field5 translation:object
  * @type_function_param1_field6 deltaTranslation:object
  * @type_function_param1_field7 cancel:boolean
  * @module events/transform
*/
/**
  * @name UI Events.dxtransformend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 rotation:number
  * @type_function_param1_field4 deltaRotation:number
  * @type_function_param1_field5 translation:object
  * @type_function_param1_field6 deltaTranslation:object
  * @type_function_param1_field7 cancel:boolean
  * @module events/transform
*/

/**
 * @name UI Events.dxtranslatestart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/transform
*/
/**
  * @name UI Events.dxtranslate
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 translation:object
  * @type_function_param1_field2 deltaTranslation:object
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/
/**
  * @name UI Events.dxtranslateend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 translation:object
  * @type_function_param1_field2 deltaTranslation:object
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
* @name UI Events.dxpinchstart
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 cancel:boolean
* @module events/transform
   */
/**
  * @name UI Events.dxpinch
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/
/**
  * @name UI Events.dxpinchend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 scale:number
  * @type_function_param1_field2 deltaScale:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/**
 * @name UI Events.dxrotatestart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/transform
*/
/**
  * @name UI Events.dxrotate
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 rotation:number
  * @type_function_param1_field2 deltaRotation:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/
/**
  * @name UI Events.dxrotateend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 rotation:number
  * @type_function_param1_field2 deltaRotation:number
  * @type_function_param1_field3 cancel:boolean
  * @module events/transform
*/

/* eslint-disable spellcheck/spell-checker */
export const {
    transformstart,
    transform,
    transformend,
    translatestart,
    translate,
    translateend,
    zoomstart,
    zoom,
    zoomend,
    pinchstart,
    pinch,
    pinchend,
    rotatestart,
    rotate,
    rotateend,
} = exportNames;

