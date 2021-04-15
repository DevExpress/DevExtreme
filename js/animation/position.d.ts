import {
    TElement
} from '../core/element';

/**
 * @docid
 * @namespace DevExpress
 * @type object
 */
export interface positionConfig {
    /**
     * @docid
     * @type Enums.PositionAlignment|object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    at?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | {
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       * @prevFileNamespace DevExpress.animation
       */
      x?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @type Enums.VerticalAlignment
       * @prevFileNamespace DevExpress.animation
       */
      y?: 'bottom' | 'center' | 'top'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    boundary?: string | TElement | Window;
    /**
     * @docid
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    boundaryOffset?: string | {
      /**
       * @docid
       * @default 0
       * @prevFileNamespace DevExpress.animation
       */
      x?: number,
      /**
       * @docid
       * @default 0
       * @prevFileNamespace DevExpress.animation
       */
      y?: number
    };
    /**
     * @docid
     * @type Enums.PositionResolveCollisionXY|object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    collision?: 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit' | {
      /**
       * @docid
       * @type Enums.PositionResolveCollision
       * @default 'none'
       * @prevFileNamespace DevExpress.animation
       */
      x?: 'fit' | 'flip' | 'flipfit' | 'none',
      /**
       * @docid
       * @type Enums.PositionResolveCollision
       * @default 'none'
       * @prevFileNamespace DevExpress.animation
       */
      y?: 'fit' | 'flip' | 'flipfit' | 'none'
    };
    /**
     * @docid
     * @type Enums.PositionAlignment|object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    my?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | {
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       * @prevFileNamespace DevExpress.animation
       */
      x?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @type Enums.VerticalAlignment
       * @prevFileNamespace DevExpress.animation
       */
      y?: 'bottom' | 'center' | 'top'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    of?: string | TElement | Window;
    /**
     * @docid
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    offset?: string | {
      /**
       * @docid
       * @default 0
       * @prevFileNamespace DevExpress.animation
       */
      x?: number,
      /**
       * @docid
       * @default 0
       * @prevFileNamespace DevExpress.animation
       */
      y?: number
    };
}
