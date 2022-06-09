import {
    UserDefinedElement,
} from '../core/element';

import {
  PositionResolveCollisionXY,
  PositionResolveCollision,
} from '../types/enums';

import {
    HorizontalAlignment,
    PositionAlignment,
    VerticalAlignment,
} from '../common';

/**
 * @docid
 * @namespace DevExpress
 * @type object
 * @public
 */
export interface PositionConfig {
    /**
     * @docid
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
