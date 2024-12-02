/**
 * @docid
 * @section commonObjectStructures
 * @public
 */
export type EventObject = {
  /**
   * @docid
   * @public
   */
  currentTarget: Element;

  /**
   * @docid
   * @public
   */
  data: any;

  /**
   * @docid
   * @public
   */
  delegateTarget: Element;

  /**
   * @docid
   * @public
   */
  target: Element;
  /**
   * @docid
   * @publicName isDefaultPrevented()
   * @public
   */
  isDefaultPrevented(): boolean;
  /**
   * @docid
   * @publicName isImmediatePropagationStopped()
   * @public
   */
  isImmediatePropagationStopped(): boolean;
  /**
   * @docid
   * @publicName isPropagationStopped()
   * @public
   */
  isPropagationStopped(): boolean;
  /**
   * @docid
   * @publicName preventDefault()
   * @public
   */
  preventDefault(): void;
  /**
   * @docid
   * @publicName stopImmediatePropagation()
   * @public
   */
  stopImmediatePropagation(): void;
  /**
   * @docid
   * @publicName stopPropagation()
   * @public
   */
  stopPropagation(): void;
};
