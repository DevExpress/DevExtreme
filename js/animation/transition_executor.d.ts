import '../jquery_augmentation';

import {
    animationConfig
} from './fx';

/**
 * @docid TransitionExecutor
 * @namespace DevExpress
 * @module animation/transition_executor
 * @export default
 * @prevFileNamespace DevExpress.animation
 * @public
 */
export default class TransitionExecutor {
    /**
     * @docid TransitionExecutor.enter
     * @publicName enter(elements, animation)
     * @param1 elements:jQuery
     * @param2 animation:animationConfig|string
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    enter(elements: JQuery, animation: animationConfig | string): void;
    /**
     * @docid TransitionExecutor.leave
     * @publicName leave(elements, animation)
     * @param1 elements:jQuery
     * @param2 animation:animationConfig|string
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    leave(elements: JQuery, animation: animationConfig | string): void;
    /**
     * @docid TransitionExecutor.reset
     * @publicName reset()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    reset(): void;
    /**
     * @docid TransitionExecutor.start
     * @publicName start()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    start(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid TransitionExecutor.stop
     * @publicName stop()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    stop(): void;
}
