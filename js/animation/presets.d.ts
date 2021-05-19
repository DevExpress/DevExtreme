import Component from '../core/component';
import {
    Device
} from '../core/devices';

import {
    animationConfig
} from './fx';

/**
 * @docid
 * @namespace DevExpress
 * @module animation/presets
 * @export default
 * @prevFileNamespace DevExpress.animation
 * @public
 */
export default class animationPresets extends Component {
    /**
     * @docid
     * @publicName applyChanges()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    applyChanges(): void;
    /**
     * @docid
     * @publicName clear()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    clear(): void;
    /**
     * @docid
     * @publicName clear(name)
     * @param1 name:string
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    clear(name: string): void;
    /**
     * @docid
     * @publicName getPreset(name)
     * @param1 name:string
     * @return object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    getPreset(name: string): { animation?: animationConfig, device?: Device };
    /**
     * @docid
     * @publicName registerDefaultPresets()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    registerDefaultPresets(): void;
    /**
     * @docid
     * @publicName registerPreset(name, config)
     * @param1 name:string
     * @param2 config:object
     * @param2_field1 animation:animationConfig
     * @param2_field2 device:Device
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    registerPreset(name: string, config: { animation?: animationConfig, device?: Device }): void;
    /**
     * @docid
     * @publicName resetToDefaults()
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    resetToDefaults(): void;
}
