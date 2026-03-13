import Widget, { WidgetOptions } from './widget/ui.widget';
import { EventInfo } from '../events';

/**
 * @docid _ui_skeleton_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxSkeleton>;

/**
 * @docid
 * @public
 */
export type SkeletonComplexType = {
    /**
     * @docid
     * @public
     */
    prop1: string;
    /**
     * @docid
     * @public
     */
    prop2: boolean;
};

/**
 * @docid
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxSkeletonOptions extends WidgetOptions<dxSkeleton> {
    /**
     * @docid
     * @public
     */
    rootPrimitiveOption?: number;
    /**
     * @docid
     * @public
     */
    rootComplexOption?: SkeletonComplexType;
}

/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSkeleton extends Widget<Properties> { }

/** @public */
export type Properties = dxSkeletonOptions;

/** @public */
export type ExplicitTypes = {
    Properties: Properties;
};

/// #DEBUG
/**
 * @hidden
 */
type Events = {
    /**
     * @docid dxSkeletonOptions.onContentReady
     * @type_function_param1 e:{ui/skeleton:ContentReadyEvent}
     */
    onContentReady?: ((e: ContentReadyEvent) => void);
};
/// #ENDDEBUG
