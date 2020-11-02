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
     * @type string|Element|jQuery|window
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    boundary?: string | Element | JQuery | Window;
    /**
     * @docid
     * @type string|object
     * @prevFileNamespace DevExpress.animation
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
     * @prevFileNamespace DevExpress.animation
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
     * @prevFileNamespace DevExpress.animation
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
     * @type string|Element|jQuery|window
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    of?: string | Element | JQuery | Window;
    /**
     * @docid
     * @type string|object
     * @prevFileNamespace DevExpress.animation
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
