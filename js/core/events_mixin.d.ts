/**
 * @docid EventsMixin
 * @module core/events_mixin
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export default class EventsMixin {
    /**
     * @docid EventsMixinMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid EventsMixinMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid EventsMixinMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid EventsMixinMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    on(events: any): this;
}
