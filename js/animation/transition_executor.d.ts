import {
    UserDefinedElementsArray
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    animationConfig
} from './fx';

/**
 * @docid
 * @namespace DevExpress
 * @module animation/transition_executor
 * @export default
 * @public
 */
export default class TransitionExecutor {
    /**
     * @docid
     * @publicName enter(elements, animation)
     * @param1 elements:jQuery
     * @param2 animation:animationConfig|string
     * @public
     */
    enter(elements: UserDefinedElementsArray, animation: animationConfig | string): void;
    /**
     * @docid
     * @publicName leave(elements, animation)
     * @param1 elements:jQuery
     * @param2 animation:animationConfig|string
     * @public
     */
    leave(elements: UserDefinedElementsArray, animation: animationConfig | string): void;
    /**
     * @docid
     * @publicName reset()
     * @public
     */
    reset(): void;
    /**
     * @docid
     * @publicName start()
     * @return Promise<void>
     * @public
     */
    start(): DxPromise<void>;
    /**
     * @docid
     * @publicName stop()
     * @public
     */
    stop(): void;
}
