import {
    Device,
} from '../core/devices';

import {
    AnimationConfig,
} from './fx';

/**
 * @docid
 * @namespace DevExpress
 * @public
 */
declare const animationPresets: {
    /**
     * @docid
     * @publicName applyChanges()
     * @public
     */
    applyChanges(): void;
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
    /**
     * @docid
     * @publicName clear(name)
     * @public
     */
    clear(name: string): void;
    /**
     * @docid
     * @publicName getPreset(name)
     * @public
     */
    getPreset(name: string): AnimationConfig;
    /**
     * @docid
     * @publicName registerDefaultPresets()
     * @public
     */
    registerDefaultPresets(): void;
    /**
     * @docid
     * @publicName registerPreset(name, config)
     * @public
     */
    registerPreset(name: string, config: { animation: AnimationConfig; device?: Device }): void;
    /**
     * @docid
     * @publicName resetToDefaults()
     * @public
     */
    resetToDefaults(): void;
};

export default animationPresets;
