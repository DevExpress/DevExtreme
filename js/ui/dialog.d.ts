import {
    DxPromise,
} from '../core/utils/deferred';

import {
    dxButtonOptions,
} from './button';

/**
 * @public
 */
export interface CustomDialogOptions {
    title?: string;
    messageHtml?: string;
    buttons?: Array<dxButtonOptions>;
    showTitle?: boolean;
    message?: string;
    dragEnabled?: boolean;
}
/**
 * @docid ui.dialog.alert
 * @publicName alert(messageHtml,title)
 * @return Promise<void>
 * @static
 * @namespace DevExpress.ui.dialog
 * @public
 */
export function alert(messageHtml: string, title: string): DxPromise<void>;

/**
 * @docid ui.dialog.confirm
 * @publicName confirm(messageHtml,title)
 * @return Promise<boolean>
 * @static
 * @namespace DevExpress.ui.dialog
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
 * @namespace DevExpress.ui.dialog
 * @public
 */
export function custom(options: CustomDialogOptions): any;
