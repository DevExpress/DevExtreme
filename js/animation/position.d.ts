import {
    UserDefinedElement,
} from '../core/element';

import {
  VerticalAlignment,
  HorizontalAlignment,
  PositionAlignment,
  PositionResolveCollisionXY,
  PositionResolveCollision,
} from '../docEnums';

/**
 * @docid
 * @namespace DevExpress
 * @type object
 * @public
 */
export interface PositionConfig {
    /**
     * @docid
     * @type docEnums.PositionAlignment|object
     * @public
     */
    at?: PositionAlignment | {
      /**
       * @docid
       */
      x?: HorizontalAlignment;
      /**
       * @docid
       */
      y?: VerticalAlignment;
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
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
    /**
     * @docid
     * @type docEnums.PositionResolveCollisionXY
     * @public
     */
    collision?: PositionResolveCollisionXY | {
      /**
       * @docid
       * @default 'none'
       */
      x?: PositionResolveCollision;
      /**
       * @docid
       * @default 'none'
       */
      y?: PositionResolveCollision;
    };
    /**
     * @docid
     * @type docEnums.PositionAlignment|object
     * @public
     */
    my?: PositionAlignment | {
      /**
       * @docid
       */
      x?: HorizontalAlignment;
      /**
       * @docid
       */
      y?: VerticalAlignment;
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
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
}

/**
 * @public
 * @deprecated Use the PositionConfig type instead
 */
export interface positionConfig extends PositionConfig { }
