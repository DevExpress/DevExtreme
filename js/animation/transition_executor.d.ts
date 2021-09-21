import {
    UserDefinedElementsArray,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    AnimationConfig,
} from './fx';

/**
 * @docid
 * @namespace DevExpress
 * @public
 */
export default class TransitionExecutor {
    /**
     * @docid
     * @publicName enter(elements, animation)
     * @param1 elements:jQuery
     * @public
     */
    enter(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
    /**
     * @docid
     * @publicName leave(elements, animation)
     * @param1 elements:jQuery
     * @public
     */
    leave(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
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
