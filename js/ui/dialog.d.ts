import {
    DxPromise
} from '../core/utils/deferred';

import {
    dxButtonOptions
} from './button';

/**
 * @public
 */
export interface CustomDialogOptions {
    title?: string,
    messageHtml?: string,
    buttons?: Array<dxButtonOptions>,
    showTitle?: boolean,
    message?: string,
    dragEnabled?: boolean
}
/**
 * @docid ui.dialog.alert
 * @publicName alert(messageHtml,title)
 * @param1 messageHtml:string
 * @param2 title:string
 * @return Promise<void>
 * @static
 * @module ui/dialog
 * @namespace DevExpress.ui.dialog
 * @export alert
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export function alert(messageHtml: string, title: string): DxPromise<void>;

/**
 * @docid ui.dialog.confirm
 * @publicName confirm(messageHtml,title)
 * @param1 messageHtml:string
 * @param2 title:string
 * @return Promise<boolean>
 * @static
 * @module ui/dialog
 * @namespace DevExpress.ui.dialog
 * @export confirm
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export function confirm(messageHtml: string, title: string): DxPromise<boolean>;

/**
 * @docid ui.dialog.custom
 * @publicName custom(options)
 * @return Object
 * @param1 options:object
 * @param1_field1 title:String
 * @param1_field2 messageHtml:String
 * @param1_field3 buttons:Array<dxButtonOptions>
 * @param1_field4 showTitle:boolean
 * @param1_field5 message:String:deprecated(messageHtml)
 * @param1_field6 dragEnabled:boolean
 * @static
 * @module ui/dialog
 * @namespace DevExpress.ui.dialog
 * @export custom
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export function custom(options: CustomDialogOptions): any;


