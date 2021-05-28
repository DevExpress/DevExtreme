import {
    UserDefinedElement
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
     * @public
     */
    at?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | {
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       */
      x?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @type Enums.VerticalAlignment
       */
      y?: 'bottom' | 'center' | 'top'
    };
    /**
     * @docid
     * @public
     */
    boundary?: string | UserDefinedElement | Window;
    /**
     * @docid
     * @public
     */
    boundaryOffset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number,
      /**
       * @docid
       * @default 0
       */
      y?: number
    };
    /**
     * @docid
     * @type Enums.PositionResolveCollisionXY|object
     * @public
     */
    collision?: 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit' | {
      /**
       * @docid
       * @type Enums.PositionResolveCollision
       * @default 'none'
       */
      x?: 'fit' | 'flip' | 'flipfit' | 'none',
      /**
       * @docid
       * @type Enums.PositionResolveCollision
       * @default 'none'
       */
      y?: 'fit' | 'flip' | 'flipfit' | 'none'
    };
    /**
     * @docid
     * @type Enums.PositionAlignment|object
     * @public
     */
    my?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | {
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       */
      x?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @type Enums.VerticalAlignment
       */
      y?: 'bottom' | 'center' | 'top'
    };
    /**
     * @docid
     * @public
     */
    of?: string | UserDefinedElement | Window;
    /**
     * @docid
     * @public
     */
    offset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number,
      /**
       * @docid
       * @default 0
       */
      y?: number
    };
}
