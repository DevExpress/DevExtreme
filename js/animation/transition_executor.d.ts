import '../jquery_augmentation';

import {
    animationConfig
} from './fx';

/**
 * @docid
 * @namespace DevExpress
 * @module animation/transition_executor
 * @export default
 * @prevFileNamespace DevExpress.animation
 * @public
 */
export default class TransitionExecutor {
    /**
     * @docid
     * @publicName enter(elements, animation)
     * @param1 elements:jQuery
     * @param2 animation:animationConfig|string
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    enter(elements: JQuery, animation: animationConfig | string): void;
    /**
     * @docid
     * @publicName leave(elements, animation)
     * @param1 elements:jQuery
     * @param2 animation:animationConfig|string
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    leave(elements: JQuery, animation: animationConfig | string): void;
    /**
     * @docid
     * @publicName reset()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    reset(): void;
    /**
     * @docid
     * @publicName start()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    start(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName stop()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    stop(): void;
}
